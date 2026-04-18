import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchTenor } from '../lib/tenor.js';

describe('searchTenor', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TENOR_API_KEY = 'test-key';
  });

  it('returns candidates for a valid query', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(
        JSON.stringify({
          results: [
            {
              id: 'xyz',
              content_description: 'shocked face',
              tags: ['shocked', 'face'],
              media_formats: {
                gif: { url: 'https://tenor.com/b.gif', dims: [640, 360] },
                tinygif: { url: 'https://tenor.com/b-prev.gif' },
              },
            },
          ],
        }),
        { status: 200 },
      ),
    ));
    const result = await searchTenor('shocked', 5);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'xyz',
      source: 'tenor',
      url: 'https://tenor.com/b.gif',
      tags: ['shocked', 'face'],
    });
  });

  it('throws when API key missing', async () => {
    delete process.env.TENOR_API_KEY;
    await expect(searchTenor('x', 5)).rejects.toThrow(/TENOR_API_KEY/);
  });
});
