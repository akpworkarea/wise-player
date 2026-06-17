import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: { width, height },
  isSmallDevice: width < 375,
  isTablet: width >= 768,
  isTV: Platform.isTV,
  isTVOS: Platform.OS === 'ios' && Platform.isTV,
  isAndroidTV: Platform.OS === 'android' && Platform.isTV,

  // Channel grid columns
  channelColumns: Platform.isTV ? 6 : width >= 768 ? 4 : 3,

  // Card sizes
  channelCardWidth: Platform.isTV ? 200 : width >= 768 ? 160 : 110,
  channelCardHeight: Platform.isTV ? 120 : width >= 768 ? 90 : 65,

  // Player
  playerControlsHeight: 80,
  sidebarWidth: Platform.isTV ? 280 : 240,
} as const;
