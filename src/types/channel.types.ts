// Channel types
export interface Channel {
  id: string;
  name: string;
  streamUrl: string;
  logo?: string;
  groupTitle: string;
  tvgId?: string;
  tvgName?: string;
  isAdult: boolean;
  isFavorite?: boolean;
  lastWatched?: number;
  resumePosition?: number;
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
  isAdult: boolean;
  isLocked?: boolean;
}
