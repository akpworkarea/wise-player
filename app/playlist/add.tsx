import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlaylistStore } from '../../src/stores/usePlaylistStore';
import { useChannelStore } from '../../src/stores/useChannelStore';
import { validateM3UUrl } from '../../src/services/m3u/m3uFetcher';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

export default function AddPlaylistScreen() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { addPlaylist } = usePlaylistStore();
  const { fetchChannels } = useChannelStore();

  const handleAdd = async () => {
    setError('');
    if (!url.trim()) { setError('Please enter a playlist URL'); return; }
    if (!validateM3UUrl(url.trim())) { setError('Invalid URL format. Must start with http:// or https://'); return; }

    setIsLoading(true);
    try {
      const playlistName = name.trim() || `Playlist ${Date.now()}`;
      addPlaylist({ name: playlistName, url: url.trim() });
      await fetchChannels(url.trim());
      router.replace('/(tabs)/channels');
    } catch {
      setError('Failed to load playlist. Check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Playlist</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Enter your M3U playlist URL to start watching</Text>

          {/* Name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PLAYLIST NAME (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="My IPTV Provider"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* URL input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>M3U PLAYLIST URL *</Text>
            <TextInput
              style={[styles.input, styles.urlInput]}
              value={url}
              onChangeText={(t) => { setUrl(t); setError(''); }}
              placeholder="http://provider.com/playlist.m3u"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              multiline
            />
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Add button */}
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <Text style={styles.addButtonText}>ADD PLAYLIST</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            💡 EPG guide is automatically detected from your playlist
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  title: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  content: { padding: Spacing.base, gap: Spacing.base },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  inputGroup: { gap: Spacing.xs },
  inputLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wider,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  urlInput: { minHeight: 80, textAlignVertical: 'top' },

  errorBox: {
    backgroundColor: 'rgba(204,0,0,0.1)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: Spacing.md,
  },
  errorText: {
    color: Colors.primary,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },

  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  addButtonDisabled: { opacity: 0.6 },
  addButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wider,
  },

  hint: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
