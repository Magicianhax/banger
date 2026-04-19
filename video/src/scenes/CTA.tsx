import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { ChunkyText } from '../components/ChunkyText';
import { FlamingDiamond } from '../components/FlamingDiamond';
import { Sticker } from '../components/Sticker';
import { colors } from '../colors';

export const CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const logoShake = Math.sin(frame / 4) * 3;

  const linkOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const linkY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const socialOpacity = interpolate(frame, [40, 60], [0, 1], {
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
          padding: 80,
          gap: 40,
        }}
      >
        <div style={{ transform: `scale(${logoScale})` }}>
          <FlamingDiamond size={260} shake={logoShake} />
        </div>

        <ChunkyText size={180}>
          BAN<span style={{ color: colors.pink }}>GER</span>
        </ChunkyText>

        <div
          style={{
            opacity: linkOpacity,
            transform: `translateY(${linkY}px) rotate(-2deg)`,
            marginTop: 16,
          }}
        >
          <Sticker background={colors.mint} padding="18px 40px">
            <span style={{ fontSize: 54, letterSpacing: 2 }}>FREE &amp; OPEN SOURCE</span>
          </Sticker>
        </div>

        <div
          style={{
            opacity: socialOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignItems: 'center',
            marginTop: 28,
            fontFamily: 'Anton, Impact, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          <div style={{ fontSize: 48, color: colors.fg }}>
            banger.magician.wtf
          </div>
          <div style={{ fontSize: 40, color: colors.pink }}>
            @B4Banger on X
          </div>
          <div style={{ fontSize: 28, color: colors.muted, marginTop: 4 }}>
            github.com/Magicianhax/banger
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
