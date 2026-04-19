import { AbsoluteFill, Audio, Sequence, Series, staticFile } from 'remotion';
import { useEffect, useState } from 'react';
import { Intro } from './scenes/Intro';
import { Problem } from './scenes/Problem';
import { ClipSlot } from './scenes/ClipSlot';
import { FiveVibes } from './scenes/FiveVibes';
import { CTA } from './scenes/CTA';

// Timing in frames @ 30fps — 60 second video.
// Adjust per-scene durations here; Series lays them end-to-end.
const DURATIONS = {
  intro: 90,      // 0:00 - 0:03
  problem: 150,   // 0:03 - 0:08
  clip1: 270,     // 0:08 - 0:17  ← demo clip #1 (open X → click diamond)
  fiveVibes: 180, // 0:17 - 0:23
  clip2: 270,     // 0:23 - 0:32  ← demo clip #2 (pick a GIF → attached)
  clip3: 240,     // 0:32 - 0:40  ← demo clip #3 (posted reply with GIF)
  cta: 600,       // 0:40 - 1:00
} as const;

export const Video: React.FC = () => {
  // Gracefully omit audio tracks that haven't been added yet.
  const [hasMusic, setHasMusic] = useState(false);
  const [hasVO, setHasVO] = useState(false);

  useEffect(() => {
    fetch(staticFile('music.mp3'), { method: 'HEAD' })
      .then((r) => setHasMusic(r.ok))
      .catch(() => setHasMusic(false));
    fetch(staticFile('voiceover.mp3'), { method: 'HEAD' })
      .then((r) => setHasVO(r.ok))
      .catch(() => setHasVO(false));
  }, []);

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={DURATIONS.intro}>
          <Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.problem}>
          <Problem />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.clip1}>
          <ClipSlot
            clipFile="clips/demo-1.mp4"
            caption="HIT THE FLAMING DIAMOND"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.fiveVibes}>
          <FiveVibes />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.clip2}>
          <ClipSlot
            clipFile="clips/demo-2.mp4"
            caption="PICK A VIBE. SENT."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.clip3}>
          <ClipSlot
            clipFile="clips/demo-3.mp4"
            caption="ATTACHES NATIVELY."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.cta}>
          <CTA />
        </Series.Sequence>
      </Series>

      {/* Music plays throughout, lowered a bit so VO sits on top. */}
      {hasMusic && (
        <Sequence from={0}>
          <Audio src={staticFile('music.mp3')} volume={0.35} />
        </Sequence>
      )}
      {/* Voice-over starts after the logo slam. */}
      {hasVO && (
        <Sequence from={DURATIONS.intro}>
          <Audio src={staticFile('voiceover.mp3')} volume={1} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
