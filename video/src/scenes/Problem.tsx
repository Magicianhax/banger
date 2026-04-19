import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { ChunkyText } from '../components/ChunkyText';
import { Sticker } from '../components/Sticker';
import { colors } from '../colors';

export const Problem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineScale = spring({ frame, fps, config: { damping: 12 } });
  const subOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [25, 45], [30, 0], {
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
          gap: 36,
          padding: 80,
          textAlign: 'center',
        }}
      >
        <div style={{ transform: `scale(${headlineScale})` }}>
          <ChunkyText size={120}>
            YOUR REPLIES
          </ChunkyText>
        </div>
        <div style={{ transform: `scale(${headlineScale}) rotate(-2deg)` }}>
          <ChunkyText size={150} color={colors.pink}>
            DESERVE BETTER.
          </ChunkyText>
        </div>
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px) rotate(-3deg)`,
            marginTop: 16,
          }}
        >
          <Sticker background={colors.amber} rotate={0} padding="14px 28px">
            <span style={{ fontSize: 36, letterSpacing: 2 }}>THE DEFAULT GIF PICKER IS MID</span>
          </Sticker>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
