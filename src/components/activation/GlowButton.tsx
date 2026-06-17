import React, { useEffect, useRef } from 'react';
import {
  Animated, StyleSheet, Text, TouchableOpacity,
  ActivityIndicator, GestureResponderEvent,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface GlowButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Primary CTA button with a looping red glow shadow.
 * Reusable wherever a high-emphasis single action needs visual weight
 * (e.g. "Add Playlist", "Confirm PIN"), not just "Activate Device".
 */
export const GlowButton: React.FC<GlowButtonProps> = ({
  label, onPress, isLoading = false, disabled = false,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View style={[styles.glowWrapper, { shadowOpacity: shadowOpacity as unknown as number }]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.textPrimary} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wider,
  },
});