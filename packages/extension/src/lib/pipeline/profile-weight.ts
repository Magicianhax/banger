import type { Candidate, Settings } from '@banger/shared';

export function applyProfileWeight(candidates: Candidate[], settings: Settings): Candidate[] {
  const block = settings.humorProfile.blocklist.map((s) => s.toLowerCase());

  return candidates.filter((c) => {
    const haystack = `${c.url} ${c.title} ${c.tags.join(' ')}`.toLowerCase();
    return !block.some((b) => haystack.includes(b));
  });
}
