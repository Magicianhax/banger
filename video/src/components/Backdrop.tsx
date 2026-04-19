import { AbsoluteFill } from 'remotion';
import { colors } from '../colors';

export const Backdrop = ({ children }: { children?: React.ReactNode }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Pink radial glow — top left */}
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(circle at 15% -10%, rgba(255, 0, 110, 0.28), transparent 55%)`,
        }}
      />
      {/* Cyan-mint radial glow — bottom right */}
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(circle at 100% 115%, rgba(0, 245, 212, 0.22), transparent 55%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
