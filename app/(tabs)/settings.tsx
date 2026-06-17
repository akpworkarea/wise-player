import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceStore } from '../../src/stores/useDeviceStore';
import { usePlaylistStore } from '../../src/stores/usePlaylistStore';
import { usePinStore } from '../../src/stores/usePinStore';
import { useHistoryStore } from '../../src/stores/useHistoryStore';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';
import { Config } from '../../src/constants/config';

export default function SettingsScreen() {
  const { deviceInfo } = useDeviceStore();
  const { playlists, activePlaylistId, setActivePlaylist, removePlaylist } = usePlaylistStore();
  const { isPinEnabled, removePin } = usePinStore();
  const { clearHistory } = useHistoryStore();

  const SettingRow = ({
    label, value, onPress, danger = false,
  }: { label: string; value?: string; onPress?: () => void; danger?: boolean }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {onPress && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Device Info */}
        <Text style={styles.sectionTitle}>DEVICE</Text>
        <View style={styles.section}>
          <SettingRow label="MAC Address" value={deviceInfo?.macDisplay} />
          <SettingRow label="Platform" value={deviceInfo?.platform?.toUpperCase()} />
          <SettingRow label="App Version" value={Config.appVersion} />
        </View>

        {/* Playlists */}
        <Text style={styles.sectionTitle}>PLAYLISTS</Text>
        <View style={styles.section}>
          {playlists.map((p) => (
            <View key={p.id} style={styles.playlistRow}>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{p.name}</Text>
                <Text style={styles.playlistUrl} numberOfLines={1}>{p.url}</Text>
              </View>
              <View style={styles.playlistActions}>
                {p.id !== activePlaylistId && (
                  <TouchableOpacity onPress={() => setActivePlaylist(p.id)} style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>Use</Text>
                  </TouchableOpacity>
                )}
                {p.id === activePlaylistId && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => removePlaylist(p.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <SettingRow label="+ Add Playlist" onPress={() => router.push('/playlist/add')} />
        </View>

        {/* Security */}
        <Text style={styles.sectionTitle}>SECURITY</Text>
        <View style={styles.section}>
          <SettingRow
            label={isPinEnabled ? 'Change PIN' : 'Set up PIN Lock'}
            onPress={() => {/* PIN setup screen */}}
          />
          {isPinEnabled && (
            <SettingRow label="Remove PIN" onPress={removePin} danger />
          )}
        </View>

        {/* Data */}
        <Text style={styles.sectionTitle}>DATA</Text>
        <View style={styles.section}>
          <SettingRow label="Clear Watch History" onPress={clearHistory} danger />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  pageTitle: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.widest,
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.textPrimary },
  settingValue: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  chevron: { fontSize: FontSize.xl, color: Colors.textSecondary },
  dangerText: { color: Colors.primary },

  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playlistInfo: { flex: 1, marginRight: Spacing.sm },
  playlistName: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  playlistUrl: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  playlistActions: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  actionBtn: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionBtnText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textPrimary },
  deleteBtn: { backgroundColor: 'rgba(204,0,0,0.15)' },
  deleteBtnText: { fontSize: FontSize.xs, color: Colors.primary },
  activeBadge: {
    backgroundColor: 'rgba(0,200,83,0.15)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  activeBadgeText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.active },
});
