import type { Candidate } from '@banger/shared';

const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

export async function searchGiphy(query: string, limit: number): Promise<Candidate[]> {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) throw new Error('GIPHY_API_KEY not set');

  const url = new URL(GIPHY_ENDPOINT);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('rating', 'pg-13');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GIPHY search failed: ${res.status}`);

  const data = (await res.json()) as { data: Array<{
    id: string;
    title: string;
    images: {
      original: { url: string; width: string; height: string };
      fixed_width_small: { url: string };
    };
  }> };

  return data.data.map((gif) => ({
    id: gif.id,
    url: gif.images.original.url,
    preview_url: gif.images.fixed_width_small.url,
    title: gif.title,
    tags: [],
    source: 'giphy' as const,
    width: parseInt(gif.images.original.width, 10),
    height: parseInt(gif.images.original.height, 10),
  }));
}
