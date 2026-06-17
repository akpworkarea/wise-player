import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../../src/stores/useFavoritesStore';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { Channel } from '../../src/types/channel.types';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../src/constants/typography';
import { Spacing, BorderRadius } from '../../src/constants/spacing';

export default function FavoritesScreen() {
  const { favorites, toggle } = useFavoritesStore();
  const { setChannel } = usePlayerStore();

  const handlePlay = (channel: Channel) => {
    setChannel(channel);
    router.push(`/player/${channel.id}`);
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>Tap the star on any channel to add it here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerCount}>{favorites.length} channels</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.channelCard} onPress={() => handlePlay(item)} activeOpacity={0.7}>
            <View style={styles.channelLeft}>
              <View style={styles.channelLogo}>
                <Text style={styles.channelLogoText}>{item.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.channelName}>{item.name}</Text>
                <Text style={styles.channelGroup}>{item.groupTitle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggle(item)} style={styles.favoriteBtn}>
              <Text style={styles.favoriteStar}>⭐</Text>
            </TouchableOpacity>
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
  headerCount: { fontSize: FontSize.sm, color: Colors.textSecondary, fontFamily: FontFamily.regular },
  list: { padding: Spacing.base, gap: Spacing.sm },
  channelCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  channelLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  channelLogo: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelLogoText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  channelName: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  channelGroup: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  favoriteBtn: { padding: Spacing.sm },
  favoriteStar: { fontSize: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.base, padding: Spacing['2xl'] },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', fontFamily: FontFamily.regular },
});
