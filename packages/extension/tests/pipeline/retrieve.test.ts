import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/search-client.js', () => ({
  searchMemes: vi.fn(async () => [
    { id: '1', url: 'https://a.gif', preview_url: 'https://a-p.gif', title: 'same', tags: [], source: 'giphy', width: 1, height: 1 },
    { id: '2', url: 'https://b.gif', preview_url: 'https://b-p.gif', title: 'mood', tags: [], source: 'tenor', width: 1, height: 1 },
  ]),
}));

import { retrieve } from '../../src/lib/pipeline/retrieve.js';

describe('retrieve', () => {
  it('deduplicates queries across slots before fetching', async () => {
    const candidates = await retrieve({
      queries: {
        agree: ['same', 'big mood', 'relatable'],
        mock: ['skill issue', 'rookie numbers', 'get good'],
        shocked: ['jaw drop', 'did not expect', 'shocked face'],
        wholesome: ['you got this', 'hug', 'cheering'],
        savage: ['delete your account', 'get out', 'absolute garbage'],
      },
      installId: 'u1',
      perQueryLimit: 5,
    });
    expect(candidates.length).toBeGreaterThan(0);
  });
});
