import { searchMemes } from '../search-client.js';
import type { Candidate, QuerySet } from '@banger/shared';

export async function retrieve(args: {
  queries: QuerySet;
  installId: string;
  perQueryLimit?: number;
}): Promise<Candidate[]> {
  const allQueries = Array.from(
    new Set([
      ...args.queries.agree,
      ...args.queries.mock,
      ...args.queries.shocked,
      ...args.queries.wholesome,
      ...args.queries.savage,
    ]),
  );
  return searchMemes(allQueries, args.installId, args.perQueryLimit ?? 5);
}
