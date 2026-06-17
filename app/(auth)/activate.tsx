import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceStore } from '../../src/stores/useDeviceStore';
import { useResponsive } from '../../src/hooks/useResponsive';
import { AnimatedLogo } from '../../src/components/splash/AnimatedLogo';
import { BrandWordmark } from '../../src/components/splash/BrandWordmark';
import { TrialBadge } from '../../src/components/activation/TrialBadge';
import { DeviceMacCard } from '../../src/components/activation/DeviceMacCard';
import { GlowButton } from '../../src/components/activation/GlowButton';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { FontFamily, FontSize } from '../../src/constants/typography';

export default function ActivateScreen() {
  const { deviceInfo, loadDeviceInfo, activate } = useDeviceStore();
  const { isTablet, isTV } = useResponsive();
  const [isActivating, setIsActivating] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    loadDeviceInfo();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleActivate = async () => {
    if (isActivating) return;
    setIsActivating(true);
    try {
      await activate();
      router.replace('/(tabs)');
    } catch {
      setIsActivating(false);
    }
  };

  // Responsive content width: full-bleed on phones, capped on tablets/TV
  // so the card doesn't stretch edge-to-edge on large screens.
  const contentMaxWidth = isTV ? 480 : isTablet ? 440 : '100%';
  const horizontalPadding = isTablet || isTV ? Spacing['3xl'] : Spacing['2xl'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { maxWidth: contentMaxWidth as any, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoBlock}>
            <AnimatedLogo size={isTablet || isTV ? 110 : 80} />
            <View style={{ height: Spacing.md }} />
            <BrandWordmark />
          </View>

          <View style={{ height: Spacing.xl }} />
          <TrialBadge />
          <View style={{ height: Spacing['2xl'] }} />

          <DeviceMacCard macAddress={deviceInfo?.macDisplay ?? 'AA:BB:CC:DD:EE:FF'} />
          <View style={{ height: Spacing.xl }} />

          <GlowButton
            label="ACTIVATE DEVICE"
            onPress={handleActivate}
            isLoading={isActivating}
          />
          <View style={{ height: Spacing.lg }} />

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ready to Activate</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logoBlock: {
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
});