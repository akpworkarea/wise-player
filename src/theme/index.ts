import { Colors } from '../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

export const Theme = {
  colors: Colors,
  fonts: FontFamily,
  fontSizes: FontSize,
  letterSpacing: LetterSpacing,
  spacing: Spacing,
  borderRadius: BorderRadius,

  // Reusable shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    red: {
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

export type AppTheme = typeof Theme;
