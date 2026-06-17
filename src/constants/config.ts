export const Config = {
  // App
  appName: 'WisePlayer',
  appVersion: '1.0.0',

  // Storage keys
  storageKeys: {
    deviceId: 'wp_device_id',
    isActivated: 'wp_is_activated',
    playlists: 'wp_playlists',
    activePlaylistId: 'wp_active_playlist_id',
    favorites: 'wp_favorites',
    history: 'wp_history',
    pin: 'wp_pin',
    pinEnabled: 'wp_pin_enabled',
    adultUnlocked: 'wp_adult_unlocked',
    lastWatched: 'wp_last_watched',
  },

  // M3U
  m3uTimeout: 30000,
  m3uMaxSize: 50 * 1024 * 1024, // 50MB max

  // EPG
  epgRefreshInterval: 12 * 60 * 60 * 1000, // 12 hours

  // Player
  playerBufferSize: 1024 * 1024 * 5, // 5MB
  resumeThreshold: 30, // seconds — resume if watched > 30s

  // History
  maxHistoryItems: 50,
  maxRecentItems: 20,

  // Adult content keywords (auto-detected from group-title)
  adultKeywords: [
    'adult', 'adults', '18+', 'xxx', 'x-rated',
    'erotic', 'mature', 'porn', 'sex', 'nsfw',
  ],

  // PIN
  pinLength: 4,

  // Trial
  trialDays: 7,
} as const;
