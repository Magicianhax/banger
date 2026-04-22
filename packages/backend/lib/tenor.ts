import type { Candidate } from '@banger/shared';

const TENOR_ENDPOINT = 'https://tenor.googleapis.com/v2/search';

type TenorFormat = { url: string; dims?: [number, number]; size?: number };

type TenorMediaFormats = {
  gif?: TenorFormat;         // full-size — can be several MB, slow to re-upload on X
  mediumgif?: TenorFormat;   // ~640 px wide — good quality, much smaller
  tinygif?: TenorFormat;     // ~220 px — smallest, used for the preview thumb
  [key: string]: TenorFormat | undefined;
};

function pickFormat(formats: TenorMediaFormats, priority: string[]): TenorFormat | null {
  for (const key of priority) {
    const f = formats[key];
    if (f && f.url) return f;
  }
  return null;
}

export async function searchTenor(query: string, limit: number): Promise<Candidate[]> {
  const apiKey = process.env.TENOR_API_KEY;
  if (!apiKey) throw new Error('TENOR_API_KEY not set');

  const url = new URL(TENOR_ENDPOINT);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('contentfilter', 'medium');
  // Ask for all three sizes so we can pick the lightest primary + a tiny preview.
  url.searchParams.set('media_filter', 'mediumgif,gif,tinygif');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tenor search failed: ${res.status}`);

  const data = (await res.json()) as {
    results: Array<{
      id: string;
      content_description: string;
      tags?: string[];
      media_formats: TenorMediaFormats;
    }>;
  };

  const candidates: Candidate[] = [];
  for (const r of data.results) {
    // mediumgif first — keeps X's upload fast. fall back to full gif if
    // medium isn't returned. tinygif stays reserved for the preview thumb.
    const primary = pickFormat(r.media_formats, ['mediumgif', 'gif', 'tinygif']);
    const preview = pickFormat(r.media_formats, ['tinygif', 'mediumgif', 'gif']);
    if (!primary || !preview) continue;

    candidates.push({
      id: r.id,
      url: primary.url,
      preview_url: preview.url,
      title: r.content_description,
      tags: r.tags ?? [],
      source: 'tenor',
      width: primary.dims?.[0] ?? 220,
      height: primary.dims?.[1] ?? 200,
    });
  }
  return candidates;
}
