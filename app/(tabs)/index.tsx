import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceStore } from '../../src/stores/useDeviceStore';
import { usePlaylistStore } from '../../src/stores/usePlaylistStore';
import { useHistoryStore } from '../../src/stores/useHistoryStore';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { deviceInfo } = useDeviceStore();
  const { playlists, getActivePlaylist } = usePlaylistStore();
  const { history } = useHistoryStore();
  const activePlaylist = getActivePlaylist();

  // Active dot pulse animation
  const activePulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(activePulse, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(activePulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const isStreaming = !!activePlaylist;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoSmall}>
                <Text style={styles.logoIcon}>▶</Text>
              </View>
              <View>
                <Text style={styles.appName}>WisePlayer</Text>
                <Text style={styles.appSubtitle}>IPTV PLAYER</Text>
              </View>
            </View>
            <View style={styles.trialBadge}>
              <Text style={styles.trialText}>7-DAY TRIAL</Text>
            </View>
          </View>

          {/* Status Card */}
          <View style={[styles.card, styles.statusCard]}>
            <View style={styles.statusLeft}>
              <Animated.View style={[styles.activeDot, { transform: [{ scale: activePulse }] }]} />
              <View>
                <Text style={[styles.statusLabel, isStreaming && styles.statusActive]}>
                  {isStreaming ? 'ACTIVE' : 'NOT ACTIVE'}
                </Text>
                <Text style={styles.statusSub}>
                  {isStreaming ? 'Device is streaming' : 'Add a playlist to start'}
                </Text>
              </View>
            </View>
            {isStreaming && (
              <TouchableOpacity
                style={styles.watchNowButton}
                onPress={() => router.push('/(tabs)/channels')}
              >
                <Text style={styles.watchNowText}>Watch</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Grid */}
          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/playlist/add')}>
              <Text style={styles.gridIcon}>📋</Text>
              <Text style={styles.gridLabel}>Upload Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                if (activePlaylist) {
                  // Trigger refresh via channel store
                }
              }}
            >
              <Text style={styles.gridIcon}>🔄</Text>
              <Text style={styles.gridLabel}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(tabs)/settings')}>
              <Text style={styles.gridIcon}>🌐</Text>
              <Text style={styles.gridLabel}>Language</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridItem]}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <Text style={styles.gridIcon}>⚙️</Text>
              <Text style={[styles.gridLabel, { color: Colors.primary }]}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* QR Section */}
          <View style={styles.qrSection}>
            <Text style={styles.sectionLabel}>SCAN OR TAP QR TO ADD PLAYLIST</Text>
            <View style={styles.qrContainer}>
              {/* QR code placeholder — integrate react-native-qrcode-svg with M3U URL */}
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>QR</Text>
              </View>
            </View>
            <Text style={styles.qrHint}>📷 Scan or Tap QR to Add Playlist</Text>
          </View>

          {/* MAC Address */}
          <View style={styles.macSection}>
            <Text style={styles.macLabel}>DEVICE MAC ADDRESS</Text>
            <Text style={styles.macAddress}>{deviceInfo?.macDisplay ?? 'AA:BB:CC:DD:EE:FF'}</Text>
            <Text style={styles.macPlatform}>
              {Platform.isTV ? '📺 OPTIMISED FOR TV PLAYERS ONLY' : '📱 ANDROID · iOS TV'}
            </Text>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'] },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoSmall: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { fontSize: 16, color: Colors.textPrimary },
  appName: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  appSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wider,
  },
  trialBadge: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  trialText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  statusCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.active,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wide,
  },
  statusActive: { color: Colors.active },
  statusSub: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  watchNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  watchNowText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  gridItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    width: (width - Spacing.base * 2 - Spacing.sm) / 2,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gridIcon: { fontSize: 24 },
  gridLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },

  qrSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wide,
    marginBottom: Spacing.md,
  },
  qrContainer: { marginBottom: Spacing.md },
  qrPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  qrPlaceholderText: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  qrHint: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
  },

  macSection: { alignItems: 'center', paddingVertical: Spacing.lg },
  macLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wider,
    marginBottom: Spacing.xs,
  },
  macAddress: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
    marginBottom: Spacing.xs,
  },
  macPlatform: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wide,
  },
});
