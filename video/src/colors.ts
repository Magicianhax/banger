// Brand palette — mirror of the extension's sticker design language.
export const colors = {
  bg: '#0a0a0f',
  bgSolid: '#0a0a0f',
  panel: '#141420',
  panel2: '#1d1d2c',
  fg: '#ffffff',
  muted: '#8a8a9a',
  pink: '#ff006e',
  amber: '#ffb800',
  mint: '#00f5d4',
  purple: '#a78bfa',
  white: '#ffffff',
  border: '#000000',
} as const;

export const slotColors: Record<string, string> = {
  agree: colors.mint,
  mock: colors.amber,
  shocked: colors.purple,
  wholesome: colors.white,
  savage: colors.pink,
};
