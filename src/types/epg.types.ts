export interface EpgProgram {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  category?: string;
  poster?: string;
}

export interface EpgChannel {
  id: string;
  name: string;
  programs: EpgProgram[];
}

export interface NowNext {
  now?: EpgProgram;
  next?: EpgProgram;
}
