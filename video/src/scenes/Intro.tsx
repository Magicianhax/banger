import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { ChunkyText } from '../components/ChunkyText';
import { FlamingDiamond } from '../components/FlamingDiamond';
import { colors } from '../colors';

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { mass: 0.8, damping: 10, stiffness: 120 },
  });

  const logoShake = Math.sin(frame / 3) * (frame > 30 ? 2 : 0);

  const wordmarkY = interpolate(frame, [15, 35], [140, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wordmarkOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div style={{ transform: `scale(${logoScale})` }}>
          <FlamingDiamond size={340} shake={logoShake} />
        </div>
        <div
          style={{
            transform: `translateY(${wordmarkY}px)`,
            opacity: wordmarkOpacity,
          }}
        >
          <ChunkyText size={180}>
            BAN<span style={{ color: colors.pink }}>GER</span>
          </ChunkyText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
