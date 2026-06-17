import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { FontFamily, FontSize } from '../../src/constants/typography';

// Simple tab icon text fallbacks (replace with SVG icons from your design)
const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <View style={{ alignItems: 'center' }}>
  </View>
);

export default function TabsLayout() {
  // TV uses sidebar, not bottom tabs
  if (Platform.isTV) {
    return null; // TV layout handled separately
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: FontSize.xs,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => null }} />
      <Tabs.Screen name="channels" options={{ title: 'Channels', tabBarIcon: ({ color }) => null }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: ({ color }) => null }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => null }} />
    </Tabs>
  );
}
