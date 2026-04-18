import type { Candidate } from '@banger/shared';

const TENOR_ENDPOINT = 'https://tenor.googleapis.com/v2/search';

export async function searchTenor(query: string, limit: number): Promise<Candidate[]> {
  const apiKey = process.env.TENOR_API_KEY;
  if (!apiKey) throw new Error('TENOR_API_KEY not set');

  const url = new URL(TENOR_ENDPOINT);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('contentfilter', 'medium');
  url.searchParams.set('media_filter', 'gif,tinygif');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tenor search failed: ${res.status}`);

  const data = (await res.json()) as { results: Array<{
    id: string;
    content_description: string;
    tags?: string[];
    media_formats: {
      gif: { url: string; dims: [number, number] };
      tinygif: { url: string };
    };
  }> };

  return data.results.map((r) => ({
    id: r.id,
    url: r.media_formats.gif.url,
    preview_url: r.media_formats.tinygif.url,
    title: r.content_description,
    tags: r.tags ?? [],
    source: 'tenor' as const,
    width: r.media_formats.gif.dims[0],
    height: r.media_formats.gif.dims[1],
  }));
}
