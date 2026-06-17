export interface Playlist {
  id: string;
  name: string;
  url: string;
  epgUrl?: string;
  addedAt: number;
  lastRefreshed?: number;
  channelCount?: number;
  isActive: boolean;
}

export interface PlaylistState {
  playlists: Playlist[];
  activePlaylistId: string | null;
}
