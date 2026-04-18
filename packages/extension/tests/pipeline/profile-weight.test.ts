import { describe, it, expect } from 'vitest';
import { applyProfileWeight } from '../../src/lib/pipeline/profile-weight.js';
import { defaultSettings } from '../../src/lib/storage.js';

describe('applyProfileWeight', () => {
  it('filters blocklisted candidates by URL', () => {
    const settings = defaultSettings();
    settings.humorProfile.blocklist = ['https://blocked.gif'];

    const candidates = [
      { id: '1', url: 'https://ok.gif', preview_url: 'https://ok-p.gif', title: 'ok', tags: [], source: 'giphy' as const, width: 1, height: 1 },
      { id: '2', url: 'https://blocked.gif', preview_url: 'https://blocked-p.gif', title: 'blocked', tags: [], source: 'giphy' as const, width: 1, height: 1 },
    ];
    const result = applyProfileWeight(candidates, settings);
    expect(result.map((c) => c.id)).toEqual(['1']);
  });

  it('filters blocklisted by tag substring', () => {
    const settings = defaultSettings();
    settings.humorProfile.blocklist = ['spongebob'];

    const candidates = [
      { id: '1', url: 'https://u1.gif', preview_url: 'https://u1-p.gif', title: 'ok', tags: ['normal'], source: 'giphy' as const, width: 1, height: 1 },
      { id: '2', url: 'https://u2.gif', preview_url: 'https://u2-p.gif', title: 'SpongeBob laughs', tags: [], source: 'giphy' as const, width: 1, height: 1 },
    ];
    const result = applyProfileWeight(candidates, settings);
    expect(result.map((c) => c.id)).toEqual(['1']);
  });
});
