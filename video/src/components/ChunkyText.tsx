import type { CSSProperties, ReactNode } from 'react';
import { colors } from '../colors';

type ChunkyTextProps = {
  children: ReactNode;
  size?: number;
  color?: string;
  accent?: string;
  outlineWidth?: number;
  shadowOffset?: number;
  style?: CSSProperties;
};

/**
 * Display-style headline with faux paint-stroke outline + hard offset shadow.
 * Uses CSS text-shadow stacked in 4 directions to simulate a stroke,
 * plus a single offset shadow for the sticker drop-shadow effect.
 */
export const ChunkyText = ({
  children,
  size = 140,
  color = colors.fg,
  outlineWidth = 3,
  shadowOffset = 8,
  style,
}: ChunkyTextProps) => {
  const o = outlineWidth;
  const stroke = [
    `${o}px 0 0 ${colors.border}`,
    `-${o}px 0 0 ${colors.border}`,
    `0 ${o}px 0 ${colors.border}`,
    `0 -${o}px 0 ${colors.border}`,
    `${o}px ${o}px 0 ${colors.border}`,
    `-${o}px ${o}px 0 ${colors.border}`,
    `${o}px -${o}px 0 ${colors.border}`,
    `-${o}px -${o}px 0 ${colors.border}`,
    `${shadowOffset}px ${shadowOffset}px 0 ${colors.border}`,
  ].join(', ');

  return (
    <span
      style={{
        fontFamily: 'Anton, Impact, sans-serif',
        fontSize: size,
        textTransform: 'uppercase',
        letterSpacing: 2,
        lineHeight: 0.95,
        color,
        textShadow: stroke,
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
