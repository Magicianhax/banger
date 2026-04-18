import { describe, it, expect, vi } from 'vitest';

vi.mock('ai', () => ({
  generateObject: vi.fn(async () => ({
    object: {
      agree: ['same', 'big mood', 'relatable'],
      mock: ['skill issue', 'rookie numbers', 'get good'],
      shocked: ['jaw drop', 'did not expect', 'shocked face'],
      wholesome: ['you got this', 'hug', 'cheering'],
      savage: ['delete your account', 'get out', 'absolute garbage'],
    },
  })),
}));

import { craftQueries } from '../../src/lib/pipeline/query-craft.js';

describe('craftQueries', () => {
  it('returns 3 queries per slot', async () => {
    const queries = await craftQueries({
      model: {} as never,
      intent: {
        subject: 'tired dev',
        emotional_tone: 'relatable',
        subculture: 'tech',
        image_description: null,
        vibe_fits: { agree: '', mock: '', shocked: '', wholesome: '', savage: '' },
        avoid: [],
        serious: false,
      },
    });
    expect(queries.agree).toHaveLength(3);
    expect(queries.savage).toHaveLength(3);
  });
});
