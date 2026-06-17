export const Colors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#222222',
  border: '#2A2A2A',

  // Brand Reds
  primary: '#CC0000',
  primaryBright: '#E8003D',
  primaryLight: '#FF6B6B',
  primaryGradientStart: '#CC0000',
  primaryGradientEnd: '#FF6B6B',

  // Status
  active: '#00C853',
  warning: '#FFB300',
  error: '#FF3D00',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',
  textInverse: '#0D0D0D',

  // Overlays
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayDark: 'rgba(0,0,0,0.9)',

  // Transparent
  transparent: 'transparent',

  // TV Focus
  tvFocus: '#CC0000',
  tvFocusShadow: 'rgba(204,0,0,0.5)',
} as const;

export type ColorKey = keyof typeof Colors;
