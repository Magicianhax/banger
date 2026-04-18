import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchMemes } from '../src/lib/search-client.js';

describe('searchMemes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POSTs queries and returns parsed candidates', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          candidates: [
            { id: '1', url: 'https://g/1.gif', preview_url: 'https://g/1p.gif', title: 't', tags: [], source: 'giphy', width: 1, height: 1 },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchMemes(['laugh'], 'install-abc', 5);
    expect(result).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/search'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Install-Id': 'install-abc' }),
      }),
    );
  });

  it('throws on non-200', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('no', { status: 500 })));
    await expect(searchMemes(['x'], 'u', 5)).rejects.toThrow();
  });
});
