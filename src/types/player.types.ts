import { Channel } from './channel.types';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';

export interface PlayerState {
  currentChannel: Channel | null;
  status: PlayerStatus;
  position: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  errorMessage?: string;
}
