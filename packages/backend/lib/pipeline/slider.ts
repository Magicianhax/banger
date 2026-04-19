import type { Candidate } from '@banger/shared';

export function pickBySlider(alternates: Candidate[], sliderValue: number): Candidate | null {
  if (alternates.length === 0) return null;
  const clamped = Math.max(0, Math.min(100, sliderValue));
  const idx = clamped < 34 ? 0 : clamped < 67 ? 1 : 2;
  return alternates[Math.min(idx, alternates.length - 1)] ?? alternates[0] ?? null;
}
