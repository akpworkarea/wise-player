import { useEffect, useState } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSmallDevice: boolean; // narrow phones, e.g. iPhone SE
  isTablet: boolean;
  isTV: boolean;
  isAndroidTV: boolean;
  isAppleTV: boolean;
  channelColumns: number;
}

const computeInfo = (size: ScaledSize): ResponsiveInfo => {
  const { width, height } = size;
  const isTV = Platform.isTV;
  const isTablet = !isTV && Math.min(width, height) >= 600;
  const isSmallDevice = !isTV && Math.min(width, height) < 360;

  return {
    width,
    height,
    isPortrait: height >= width,
    isLandscape: width > height,
    isSmallDevice,
    isTablet,
    isTV,
    isAndroidTV: Platform.OS === 'android' && isTV,
    isAppleTV: Platform.OS === 'ios' && isTV,
    channelColumns: isTV ? 6 : isTablet ? 4 : 3,
  };
};

/**
 * Reactive replacement for the static values in constants/layout.ts.
 *
 * Problem this solves: Dimensions.get('window') in layout.ts is read once
 * at module load time. It never updates on rotation, split-screen resize,
 * or foldable hinge changes, so every screen importing it silently uses
 * stale numbers after the device size changes. This hook subscribes to
 * the 'change' event and re-renders consuming components with live values.
 */
export const useResponsive = (): ResponsiveInfo => {
  const [info, setInfo] = useState<ResponsiveInfo>(() => computeInfo(Dimensions.get('window')));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setInfo(computeInfo(window));
    });
    return () => subscription.remove();
  }, []);

  return info;
};