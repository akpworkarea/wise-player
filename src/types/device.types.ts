export interface DeviceInfo {
  deviceId: string;
  macDisplay: string;
  platform: 'android' | 'ios' | 'android_tv' | 'apple_tv';
  isActivated: boolean;
  activatedAt?: number;
  trialStartedAt?: number;
}
