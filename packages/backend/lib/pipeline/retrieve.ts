import { searchGiphy } from '../giphy';
import { searchTenor } from '../tenor';
import type { Candidate, QuerySet } from '@banger/shared';

export async function retrieve(args: {
  queries: QuerySet;
  perQueryLimit?: number;
}): Promise<Candidate[]> {
  const allQueries = Array.from(new Set([
    ...args.queries.agree,
    ...args.queries.mock,
    ...args.queries.shocked,
    ...args.queries.wholesome,
    ...args.queries.savage,
  ]));
  const limit = args.perQueryLimit ?? 5;

  const results = await Promise.allSettled(
    allQueries.flatMap((q) => [searchGiphy(q, limit), searchTenor(q, limit)]),
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
  return candidates;
}
