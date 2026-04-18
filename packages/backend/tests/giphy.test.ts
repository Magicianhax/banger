import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchGiphy } from '../lib/giphy.js';

describe('searchGiphy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GIPHY_API_KEY = 'test-key';
  });

  it('returns candidates for a valid query', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'abc',
              title: 'laughing meme',
              images: {
                original: { url: 'https://giphy.com/a.gif', width: '480', height: '270' },
                fixed_width_small: { url: 'https://giphy.com/a-prev.gif' },
              },
            },
          ],
        }),
        { status: 200 },
      ),
    ));
    const result = await searchGiphy('laugh', 5);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'abc',
      source: 'giphy',
      url: 'https://giphy.com/a.gif',
      title: 'laughing meme',
    });
  });

  it('throws when API key missing', async () => {
    delete process.env.GIPHY_API_KEY;
    await expect(searchGiphy('x', 5)).rejects.toThrow(/GIPHY_API_KEY/);
  });
});
