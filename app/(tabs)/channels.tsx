import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChannelStore } from '../../src/stores/useChannelStore';
import { usePlaylistStore } from '../../src/stores/usePlaylistStore';
import { usePinStore } from '../../src/stores/usePinStore';
import { Category } from '../../src/types/channel.types';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

export default function ChannelsScreen() {
  const { categories, isLoading, error, fetchChannels } = useChannelStore();
  const { getActivePlaylist } = usePlaylistStore();
  const { isPinEnabled, isAdultUnlocked } = usePinStore();
  const activePlaylist = getActivePlaylist();

  useEffect(() => {
    if (activePlaylist?.url) {
      fetchChannels(activePlaylist.url);
    }
  }, [activePlaylist?.id]);

  const handleCategoryPress = (category: Category) => {
    if (category.isAdult && isPinEnabled && !isAdultUnlocked) {
      // TODO: Show PIN modal
      return;
    }
    useChannelStore.getState().setSelectedCategory(category.id);
    router.push(`/(tabs)/channels`);
  };

  if (!activePlaylist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Playlist Added</Text>
          <Text style={styles.emptySubtitle}>Add an M3U playlist to browse channels</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/playlist/add')}>
            <Text style={styles.addBtnText}>ADD PLAYLIST</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading channels...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerCount}>{categories.length} groups</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryLeft}>
              <Text style={styles.categoryIcon}>{item.isAdult ? '🔞' : '📺'}</Text>
              <View>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.channels.length} channels</Text>
              </View>
            </View>
            <View style={styles.categoryRight}>
              {item.isAdult && isPinEnabled && !isAdultUnlocked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  headerCount: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },

  list: { padding: Spacing.base, gap: Spacing.sm },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  categoryIcon: { fontSize: 24 },
  categoryName: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  categoryCount: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  categoryRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lockBadge: {
    backgroundColor: 'rgba(204,0,0,0.15)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
  },
  lockIcon: { fontSize: 12 },
  chevron: { fontSize: FontSize.xl, color: Colors.textSecondary },

  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.base },
  loadingText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.base, padding: Spacing['2xl'] },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center' },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  addBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textPrimary, letterSpacing: LetterSpacing.wider },
});
