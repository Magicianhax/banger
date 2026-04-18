import { SearchResponseSchema, type Candidate } from '@banger/shared';
import { BACKEND_URL } from '../env.js';

export async function searchMemes(
  queries: string[],
  installId: string,
  limit: number = 5,
): Promise<Candidate[]> {
  const res = await fetch(`${BACKEND_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Install-Id': installId,
    },
    body: JSON.stringify({ queries, limit }),
  });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }
  const data = SearchResponseSchema.parse(await res.json());
  return data.candidates;
}
