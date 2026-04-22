import type { Candidate } from '@banger/shared';

const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

type GiphyImage = {
  url: string;
  width?: string;
  height?: string;
  size?: string;
};

type GiphyImages = {
  // Full original — often 2–5 MB, slow for X to re-upload.
  original?: GiphyImage;
  // Giphy-downsized to <2 MB while preserving original aspect ratio.
  downsized?: GiphyImage;
  // Fixed 200 px tall, typically 200–500 KB — best balance for X replies.
  fixed_height?: GiphyImage;
  fixed_width_small?: GiphyImage;
  // Tiny thumbnail used only for the preview tile in the popover.
  [key: string]: GiphyImage | undefined;
};

/**
 * Pick the first available variant from a priority list. Giphy sometimes
 * omits particular sizes (especially for very short or very small GIFs).
 */
function pickVariant(images: GiphyImages, priority: string[]): GiphyImage | null {
  for (const key of priority) {
    const img = images[key];
    if (img && img.url) return img;
  }
  return null;
}

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

  const data = (await res.json()) as {
    data: Array<{ id: string; title: string; images: GiphyImages }>;
  };

  const candidates: Candidate[] = [];
  for (const gif of data.data) {
    // Pick a lightweight GIF so X's native upload finishes in seconds,
    // not minutes. fixed_height → downsized → original is roughly smallest
    // to largest while keeping decent visual quality.
    const primary = pickVariant(gif.images, ['fixed_height', 'downsized', 'original']);
    const preview = pickVariant(gif.images, ['fixed_width_small', 'fixed_height', 'original']);
    if (!primary || !preview) continue;

    candidates.push({
      id: gif.id,
      url: primary.url,
      preview_url: preview.url,
      title: gif.title,
      tags: [],
      source: 'giphy',
      width: primary.width ? parseInt(primary.width, 10) || 200 : 200,
      height: primary.height ? parseInt(primary.height, 10) || 200 : 200,
    });
  }
  return candidates;
}
