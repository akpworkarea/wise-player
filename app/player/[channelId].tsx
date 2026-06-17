import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Dimensions, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { useHistoryStore } from '../../src/stores/useHistoryStore';
import { useFavoritesStore } from '../../src/stores/useFavoritesStore';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

const { width, height } = Dimensions.get('window');

// VLC Player import — uncomment when package is installed
// import VLCPlayer from 'react-native-vlc-media-player';

export default function PlayerScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const { currentChannel, status, setStatus, setError, saveResumePosition, setPosition } = usePlayerStore();
  const { addToHistory } = useHistoryStore();
  const { toggle, isFavorite } = useFavoritesStore();

  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const controlsFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);
    if (currentChannel) {
      addToHistory(currentChannel);
    }
    return () => {
      StatusBar.setHidden(false);
      saveResumePosition();
    };
  }, []);

  const showControls = () => {
    setControlsVisible(true);
    Animated.timing(controlsFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(hideControls, 4000);
  };

  const hideControls = () => {
    Animated.timing(controlsFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setControlsVisible(false);
    });
  };

  if (!currentChannel) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No channel selected</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavorite(currentChannel.id);

  return (
    <View style={styles.container}>

      {/* VIDEO LAYER — Replace View with VLCPlayer when installed */}
      <TouchableOpacity style={styles.videoContainer} onPress={showControls} activeOpacity={1}>
        {/* <VLCPlayer
          source={{ uri: currentChannel.streamUrl }}
          style={StyleSheet.absoluteFill}
          onPlaying={() => setStatus('playing')}
          onBuffering={() => setStatus('buffering')}
          onError={(e) => setError(e?.error ?? 'Stream error')}
          onProgress={(e) => setPosition(e.currentTime / 1000)}
          autoplay
        /> */}
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoPlaceholderText}>▶ {currentChannel.name}</Text>
          <Text style={styles.videoPlaceholderSub}>VLC Player renders here</Text>
        </View>
      </TouchableOpacity>

      {/* STATUS OVERLAY */}
      {status === 'buffering' || status === 'loading' ? (
        <View style={styles.bufferingOverlay}>
          <Text style={styles.bufferingText}>Buffering...</Text>
        </View>
      ) : null}

      {status === 'error' ? (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorOverlayText}>⚠ Stream unavailable</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => setStatus('loading')}>
            <Text style={styles.retryText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* CONTROLS OVERLAY */}
      <Animated.View style={[styles.controls, { opacity: controlsFade }]} pointerEvents={controlsVisible ? 'auto' : 'none'}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName} numberOfLines={1}>{currentChannel.name}</Text>
            <Text style={styles.channelGroup}>{currentChannel.groupTitle}</Text>
          </View>
          <TouchableOpacity onPress={() => toggle(currentChannel)} style={styles.favBtn}>
            <Text style={styles.favBtnText}>{isFav ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { ...StyleSheet.absoluteFillObject },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  videoPlaceholderText: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary },
  videoPlaceholderSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm },

  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingText: { color: Colors.textPrimary, fontFamily: FontFamily.medium, fontSize: FontSize.base },

  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  errorOverlayText: { color: Colors.primary, fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  retryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  retryText: { color: Colors.textPrimary, fontFamily: FontFamily.bold, fontSize: FontSize.sm },

  controls: { ...StyleSheet.absoluteFillObject },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.overlayDark,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontSize: 28, color: Colors.textPrimary },
  channelInfo: { flex: 1, marginHorizontal: Spacing.sm },
  channelName: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  channelGroup: { fontSize: FontSize.xs, color: Colors.textSecondary, fontFamily: FontFamily.regular },
  favBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  favBtnText: { fontSize: 22 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.overlayDark,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textPrimary },
  liveText: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  errorText: { color: Colors.textPrimary, fontFamily: FontFamily.medium, fontSize: FontSize.base },
  backText: { color: Colors.primary, fontFamily: FontFamily.medium, fontSize: FontSize.base, marginTop: Spacing.base },
});
