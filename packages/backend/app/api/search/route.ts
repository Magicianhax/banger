import { z } from 'zod';
import { NextResponse } from 'next/server';
import { searchGiphy } from '../../../lib/giphy.js';
import { searchTenor } from '../../../lib/tenor.js';
import { InMemoryRateLimiter } from '../../../lib/rate-limit.js';
import type { Candidate } from '@banger/shared';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  queries: z.array(z.string().min(1).max(100)).min(1).max(20),
  limit: z.number().int().min(1).max(10).default(5),
});

const limiter = new InMemoryRateLimiter({ windowMs: 60_000, max: 120 });

export async function POST(req: Request) {
  const installId = req.headers.get('x-install-id');
  if (!installId) {
    return NextResponse.json({ error: 'missing x-install-id' }, { status: 400 });
  }
  if (!limiter.allow(installId)) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const { queries, limit } = parsed.data;

  const results = await Promise.allSettled(
    queries.flatMap((q) => [searchGiphy(q, limit), searchTenor(q, limit)]),
  );

  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const c of r.value) {
        if (!seen.has(c.url)) {
          seen.add(c.url);
          candidates.push(c);
        }
      }
    }
  }

  return NextResponse.json({ candidates });
}
