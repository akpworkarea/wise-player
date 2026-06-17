import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface BrandWordmarkProps {
  delay?: number;
}

/**
 * "WisePlayer / IPTV PLAYER" wordmark with a fade-up entrance.
 * Shared between splash and activation screens to keep brand presentation consistent.
 */
export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ delay = 200 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], alignItems: 'center' }}>
      <Text style={styles.appName}>WisePlayer</Text>
      <Text style={styles.appSubtitle}>IPTV PLAYER</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  appName: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.extraBold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.tight,
  },
  appSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.widest,
    marginTop: Spacing.xs,
  },
});