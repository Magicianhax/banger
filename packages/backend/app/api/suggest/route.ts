import { z } from 'zod';
import { NextResponse } from 'next/server';
import { TweetContextSchema } from '@banger/shared';
import { runServerPipeline } from '@/lib/pipeline';
import { InMemoryRateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  tweet: TweetContextSchema,
  sliderValue: z.number().min(0).max(100).default(50),
  blocklist: z.array(z.string()).optional(),
  sendImages: z.boolean().optional(),
});

// Tighter limits now that we pay: 20 req/min and 200/day per install-id.
const perMinute = new InMemoryRateLimiter({ windowMs: 60_000, max: 20 });
const perDay = new InMemoryRateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 200 });

export async function POST(req: Request) {
  const installId = req.headers.get('x-install-id');
  if (!installId) {
    return NextResponse.json({ error: 'missing x-install-id' }, { status: 400 });
  }
  if (!perMinute.allow(installId) || !perDay.allow(installId)) {
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

  try {
    const result = await runServerPipeline(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
