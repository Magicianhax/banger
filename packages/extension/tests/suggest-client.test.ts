import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSuggestions } from '../src/lib/search-client.js';

describe('fetchSuggestions', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('POSTs tweet + slider and returns result', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ suggestions: [], sensitive: false, latencyMs: 10 }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchSuggestions({
      tweet: { tweetId: '1', authorHandle: '@x', text: 'hi', imageUrls: [], threadContext: [] },
      sliderValue: 50,
      installId: 'u',
    });
    expect(result.sensitive).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/suggest'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Install-Id': 'u' }),
      }),
    );
  });

  it('throws on non-200', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));
    await expect(fetchSuggestions({
      tweet: { tweetId: '1', authorHandle: '@x', text: 'x', imageUrls: [], threadContext: [] },
      sliderValue: 50, installId: 'u',
    })).rejects.toThrow();
  });
});
