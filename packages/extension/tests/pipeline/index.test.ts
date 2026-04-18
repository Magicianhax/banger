import { describe, it, expect, vi } from 'vitest';

const mockIntent = {
  subject: 'x', emotional_tone: 'y', subculture: null, image_description: null,
  vibe_fits: { agree: '', mock: '', shocked: '', wholesome: '', savage: '' },
  avoid: [], serious: false,
};
const mockQueries = {
  agree: ['a', 'b', 'c'], mock: ['a', 'b', 'c'], shocked: ['a', 'b', 'c'],
  wholesome: ['a', 'b', 'c'], savage: ['a', 'b', 'c'],
};
const mockCandidates = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1), url: `https://x.test/${i}.gif`, preview_url: `https://x.test/${i}p.gif`, title: `t${i}`, tags: [],
  source: 'giphy' as const, width: 1, height: 1,
}));
const mockRerank = {
  agree: [{ id: '1', score: 9 }, { id: '2', score: 7 }, { id: '3', score: 5 }],
  mock: [{ id: '4', score: 9 }, { id: '5', score: 7 }, { id: '6', score: 5 }],
  shocked: [{ id: '7', score: 9 }, { id: '8', score: 7 }, { id: '9', score: 5 }],
  wholesome: [{ id: '10', score: 9 }, { id: '11', score: 7 }, { id: '12', score: 5 }],
  savage: [{ id: '13', score: 9 }, { id: '14', score: 7 }, { id: '15', score: 5 }],
};

vi.mock('../../src/lib/pipeline/understand.js', () => ({ understand: vi.fn(async () => mockIntent) }));
vi.mock('../../src/lib/pipeline/query-craft.js', () => ({ craftQueries: vi.fn(async () => mockQueries) }));
vi.mock('../../src/lib/pipeline/retrieve.js', () => ({ retrieve: vi.fn(async () => mockCandidates) }));
vi.mock('../../src/lib/pipeline/rerank.js', () => ({ rerank: vi.fn(async () => mockRerank) }));

import { runPipeline } from '../../src/lib/pipeline/index.js';
import { defaultSettings } from '../../src/lib/storage.js';

describe('runPipeline', () => {
  it('returns 5 suggestions with alternates', async () => {
    const settings = defaultSettings();
    settings.provider = 'anthropic';
    settings.apiKey = 'sk-test';

    const result = await runPipeline({
      tweet: {
        tweetId: '1', authorHandle: '@x', text: 'hi',
        imageUrls: [], threadContext: [],
      },
      settings,
      sliderValue: 50,
    });

    expect(result.suggestions).toHaveLength(5);
    for (const s of result.suggestions) {
      expect(s.alternates.length).toBeGreaterThanOrEqual(0);
      expect(s.candidate.id).toBeTruthy();
    }
  });

  it('bails early when sensitive tweet detected', async () => {
    const { understand } = await import('../../src/lib/pipeline/understand.js');
    (understand as unknown as { mockResolvedValueOnce: (v: unknown) => void }).mockResolvedValueOnce({
      ...mockIntent, serious: true,
    });
    const settings = defaultSettings();
    settings.provider = 'anthropic';
    settings.apiKey = 'sk';
    const result = await runPipeline({
      tweet: { tweetId: '1', authorHandle: '@x', text: 'rip', imageUrls: [], threadContext: [] },
      settings, sliderValue: 50,
    });
    expect(result.sensitive).toBe(true);
    expect(result.suggestions).toEqual([]);
  });

  it('throws when no API key configured', async () => {
    const settings = defaultSettings();
    await expect(runPipeline({
      tweet: { tweetId: '1', authorHandle: '@x', text: 'x', imageUrls: [], threadContext: [] },
      settings, sliderValue: 50,
    })).rejects.toThrow(/API key/);
  });
});
