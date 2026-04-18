import { describe, it, expect, vi } from 'vitest';

vi.mock('ai', () => ({
  generateObject: vi.fn(async () => ({
    object: {
      agree:     [{ id: '1', score: 9 }, { id: '2', score: 7 }, { id: '3', score: 5 }],
      mock:      [{ id: '4', score: 9 }, { id: '5', score: 7 }, { id: '6', score: 5 }],
      shocked:   [{ id: '7', score: 9 }, { id: '8', score: 7 }, { id: '9', score: 5 }],
      wholesome: [{ id: '10', score: 9 }, { id: '11', score: 7 }, { id: '12', score: 5 }],
      savage:    [{ id: '13', score: 9 }, { id: '14', score: 7 }, { id: '15', score: 5 }],
    },
  })),
}));

import { rerank } from '../../src/lib/pipeline/rerank.js';

describe('rerank', () => {
  it('returns 3 scored candidates per slot', async () => {
    const candidates = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      url: `https://x/${i}.gif`,
      preview_url: `https://x/${i}p.gif`,
      title: `gif ${i}`,
      tags: [],
      source: 'giphy' as const,
      width: 1,
      height: 1,
    }));
    const result = await rerank({
      model: {} as never,
      intent: {
        subject: 'x',
        emotional_tone: 'y',
        subculture: null,
        image_description: null,
        vibe_fits: { agree: '', mock: '', shocked: '', wholesome: '', savage: '' },
        avoid: [],
        serious: false,
      },
      tweetText: 'hello',
      candidates,
    });
    expect(result.agree).toHaveLength(3);
    expect(result.savage[0]?.score).toBe(9);
  });
});
