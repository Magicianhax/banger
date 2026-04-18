import { describe, it, expect, vi } from 'vitest';

vi.mock('ai', () => ({
  generateObject: vi.fn(async () => ({
    object: {
      subject: 'dev is tired',
      emotional_tone: 'self-deprecating',
      subculture: 'tech',
      image_description: null,
      vibe_fits: {
        agree: 'same',
        mock: 'skill issue',
        shocked: 'jaw drop',
        wholesome: 'you got this',
        savage: 'get a real job',
      },
      avoid: [],
      serious: false,
    },
  })),
}));

import { understand } from '../../src/lib/pipeline/understand.js';

describe('understand', () => {
  it('returns structured intent', async () => {
    const intent = await understand({
      model: {} as never,
      tweet: {
        tweetId: '1',
        authorHandle: '@x',
        text: 'I just finished my 3rd cup of coffee and still cannot open VSCode',
        imageUrls: [],
        threadContext: [],
      },
      sendImages: true,
    });
    expect(intent.subculture).toBe('tech');
    expect(intent.serious).toBe(false);
    expect(intent.vibe_fits.agree).toBeTruthy();
  });
});
