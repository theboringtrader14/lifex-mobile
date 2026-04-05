import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { T } from '../../theme';

interface Props { onPress: () => void; listening?: boolean }

export function MicButton({ onPress, listening = false }: Props) {
  const ring1Scale = useSharedValue(0.94);
  const ring1Opacity = useSharedValue(1);
  const ring2Scale = useSharedValue(0.94);
  const ring2Opacity = useSharedValue(1);

  useEffect(() => {
    ring1Scale.value = withRepeat(withTiming(1.06, { duration: 2000 }), -1, true);
    ring1Opacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1, false);
    ring2Scale.value = withDelay(600, withRepeat(withTiming(1.06, { duration: 2000 }), -1, true));
    ring2Opacity.value = withDelay(600, withRepeat(withTiming(0, { duration: 2000 }), -1, false));
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  return (
    <View style={styles.wrap}>
      {/* Pulse ring 1 */}
      <Animated.View style={[styles.ring1, ring1Style]} pointerEvents="none" />
      {/* Pulse ring 2 */}
      <Animated.View style={[styles.ring2, ring2Style]} pointerEvents="none" />
      {/* Button */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={styles.btn}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect x={9} y={3} width={6} height={11} rx={3} fill={T.orange} />
            <Path d="M5 11a7 7 0 0014 0" stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
            <Line x1={12} y1={18} x2={12} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
            <Line x1={9} y1={21} x2={15} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 66, height: 66, alignItems: 'center', justifyContent: 'center' },
  ring1: {
    position: 'absolute', width: 82, height: 82, borderRadius: 41,
    borderWidth: 2, borderColor: 'rgba(255,107,0,0.22)',
  },
  ring2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    borderWidth: 1.5, borderColor: 'rgba(255,107,0,0.10)',
  },
  btn: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: '#E8EEF6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#A3B1C6', shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75, shadowRadius: 16, elevation: 8,
  },
});
