import type { CSSProperties, ReactNode } from 'react';
import { colors } from '../colors';

type StickerProps = {
  children: ReactNode;
  background?: string;
  color?: string;
  padding?: number | string;
  rotate?: number;
  shadow?: number;
  radius?: number;
  borderWidth?: number;
  style?: CSSProperties;
};

/**
 * Chunky sticker container — thick black border + hard offset shadow.
 * Matches the `.panel` / `.tag` design language in the extension.
 */
export const Sticker = ({
  children,
  background = colors.amber,
  color = colors.border,
  padding = '18px 28px',
  rotate = 0,
  shadow = 10,
  radius = 16,
  borderWidth = 4,
  style,
}: StickerProps) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background,
        color,
        padding,
        border: `${borderWidth}px solid ${colors.border}`,
        borderRadius: radius,
        boxShadow: `${shadow}px ${shadow}px 0 ${colors.border}`,
        transform: `rotate(${rotate}deg)`,
        fontFamily: 'Anton, Impact, sans-serif',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
