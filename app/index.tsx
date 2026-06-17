import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useDeviceStore } from '../src/stores/useDeviceStore';
import { useFavoritesStore } from '../src/stores/useFavoritesStore';
import { useHistoryStore } from '../src/stores/useHistoryStore';
import { usePlaylistStore } from '../src/stores/usePlaylistStore';
import { usePinStore } from '../src/stores/usePinStore';
import { Colors } from '../src/constants/colors';

export default function Index() {
  const { deviceInfo, loadDeviceInfo, isLoading } = useDeviceStore();
  const loadFavorites = useFavoritesStore((s) => s.load);
  const loadHistory = useHistoryStore((s) => s.load);
  const loadPlaylists = usePlaylistStore((s) => s.loadPlaylists);
  const loadPin = usePinStore((s) => s.load);

  useEffect(() => {
    loadDeviceInfo();
    loadFavorites();
    loadHistory();
    loadPlaylists();
    loadPin();
  }, []);

  if (isLoading || !deviceInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  // Route based on activation state
  if (!deviceInfo.isActivated) {
    return <Redirect href="/(auth)/activate" />;
  }

  return <Redirect href="/(tabs)" />;
}
