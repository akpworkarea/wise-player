import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface TrialBadgeProps {
  label?: string;
}

/**
 * Outlined pill badge, e.g. "7-DAY TRIAL". Reusable on activation,
 * home, and settings screens wherever trial/plan status is shown.
 */
export const TrialBadge: React.FC<TrialBadgeProps> = ({ label = '7-DAY TRIAL' }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
  },
});