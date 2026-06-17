import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface AnimatedLogoProps {
  size?: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 96 }) => {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
          },
        ]}
      >
        <View style={styles.triangle} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 24,
    shadowOpacity: 0.4,
    elevation: 12,
  },
  iconBox: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  triangle: {
    width: 0,
    height: 0,
    marginLeft: 6,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 16,
    borderBottomWidth: 16,
    borderLeftWidth: 26,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.textPrimary,
  },
});