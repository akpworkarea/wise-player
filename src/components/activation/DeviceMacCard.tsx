import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface DeviceMacCardProps {
  macAddress: string;
}

/**
 * Displays the device's MAC/fingerprint identifier in a pulsing card.
 * Reused on the activation screen and (later) the settings/device-info
 * screen, so the same visual treatment stays consistent everywhere.
 */
export const DeviceMacCard: React.FC<DeviceMacCardProps> = ({ macAddress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}>
      <Text style={styles.label}>DEVICE MAC ADDRESS</Text>
      <Text style={styles.address} selectable>
        {macAddress}
      </Text>
      <Text style={styles.hint}>
        {Platform.isTV ? '📺 OPTIMISED FOR TV PLAYERS' : '📱 ANDROID · iOS · TV'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wider,
    marginBottom: Spacing.sm,
  },
  address: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
    marginBottom: Spacing.sm,
  },
  hint: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
  },
});