import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { ChunkyText } from '../components/ChunkyText';
import { colors, slotColors } from '../colors';

const VIBES = ['AGREE', 'MOCK', 'SHOCKED', 'WHOLESOME', 'SAVAGE'] as const;

export const FiveVibes = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerScale = spring({ frame, fps, config: { damping: 12 } });

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
          gap: 60,
        }}
      >
        <div style={{ transform: `scale(${headerScale})` }}>
          <ChunkyText size={150}>
            FIVE <span style={{ color: colors.pink }}>VIBES</span>.
          </ChunkyText>
        </div>

        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {VIBES.map((v, i) => {
            const delay = 8 + i * 6;
            const appear = spring({
              frame: frame - delay,
              fps,
              config: { damping: 10, mass: 0.6, stiffness: 150 },
            });
            const wiggle = Math.sin(frame / 8 + i) * 3;
            const bg = slotColors[v.toLowerCase()] ?? colors.pink;
            return (
              <div
                key={v}
                style={{
                  transform: `scale(${appear}) rotate(${wiggle}deg)`,
                  width: 200,
                  height: 200,
                  background: bg,
                  border: `5px solid ${colors.border}`,
                  borderRadius: 18,
                  boxShadow: `8px 8px 0 ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Anton, Impact, sans-serif',
                  fontSize: 26,
                  letterSpacing: 2,
                  color: v === 'WHOLESOME' ? colors.border : colors.border,
                  textTransform: 'uppercase',
                }}
              >
                {v}
              </div>
            );
          })}
        </div>

        <div style={{ transform: `scale(${headerScale}) rotate(-2deg)`, marginTop: 12 }}>
          <ChunkyText size={110} color={colors.amber}>
            ONE CLICK.
          </ChunkyText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
