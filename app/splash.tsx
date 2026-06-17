import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedLogo } from '../src/components/splash/AnimatedLogo';
import { BrandWordmark } from '../src/components/splash/BrandWordmark';
import { LoadingDots } from '../src/components/splash/LoadingDots';
import { useDeviceStore } from '../src/stores/useDeviceStore';
import { useFavoritesStore } from '../src/stores/useFavoritesStore';
import { useHistoryStore } from '../src/stores/useHistoryStore';
import { usePlaylistStore } from '../src/stores/usePlaylistStore';
import { usePinStore } from '../src/stores/usePinStore';
import { hydrateStorage } from '../src/services/storage/mmkvStorage';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';

// Minimum time to show the splash screen, so the logo animation always
// gets to play even on devices where storage hydration is instant.
const MIN_SPLASH_DURATION = 1400;

export default function SplashScreen() {
  const [isReady, setIsReady] = useState(false);
  const { deviceInfo, loadDeviceInfo } = useDeviceStore();
  const loadFavorites = useFavoritesStore((s) => s.load);
  const loadHistory = useHistoryStore((s) => s.load);
  const loadPlaylists = usePlaylistStore((s) => s.loadPlaylists);
  const loadPin = usePinStore((s) => s.load);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    (async () => {
      // Storage must be hydrated before any store reads happen, or every
      // load() call below would read an empty cache and look like a fresh install.
      await hydrateStorage();
      await loadDeviceInfo();
      loadFavorites();
      loadHistory();
      loadPlaylists();
      loadPin();

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_SPLASH_DURATION - elapsed, 0);

      setTimeout(() => {
        if (isMounted) setIsReady(true);
      }, remaining);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isReady && deviceInfo) {
    return deviceInfo.isActivated
      ? <Redirect href="/(tabs)" />
      : <Redirect href="/(auth)/activate" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AnimatedLogo size={96} />
        <View style={{ height: Spacing.xl }} />
        <BrandWordmark delay={250} />
      </View>
      <View style={styles.footer}>
        <LoadingDots />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
});