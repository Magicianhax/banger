import type { Candidate } from '@banger/shared';

export function applyProfileWeight(
  candidates: Candidate[],
  blocklist: string[] = [],
): Candidate[] {
  const block = blocklist.map((s) => s.toLowerCase());
  return candidates.filter((c) => {
    const haystack = `${c.url} ${c.title} ${c.tags.join(' ')}`.toLowerCase();
    return !block.some((b) => haystack.includes(b));
  });
}
