import { describe, it, expect } from 'vitest';
import { pickBySlider } from '../../src/lib/pipeline/slider.js';

describe('pickBySlider', () => {
  const alternates = [
    { id: 'mild', url: 'https://u1.gif', preview_url: 'https://u1-p.gif', title: '', tags: [], source: 'giphy' as const, width: 1, height: 1 },
    { id: 'medium', url: 'https://u2.gif', preview_url: 'https://u2-p.gif', title: '', tags: [], source: 'giphy' as const, width: 1, height: 1 },
    { id: 'intense', url: 'https://u3.gif', preview_url: 'https://u3-p.gif', title: '', tags: [], source: 'giphy' as const, width: 1, height: 1 },
  ];

  it('returns mild at low values', () => {
    expect(pickBySlider(alternates, 10).id).toBe('mild');
  });

  it('returns medium at center', () => {
    expect(pickBySlider(alternates, 50).id).toBe('medium');
  });

  it('returns intense at high values', () => {
    expect(pickBySlider(alternates, 90).id).toBe('intense');
  });

  it('handles missing alternates gracefully', () => {
    const one = [alternates[0]!];
    expect(pickBySlider(one, 80).id).toBe('mild');
  });
});
