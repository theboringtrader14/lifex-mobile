import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Rect, Path, Line } from 'react-native-svg';
import { T } from '../../theme';

interface Props { onPress: () => void; listening?: boolean }

export function MicButton({ onPress, listening = false }: Props) {
  const ring1Scale = useRef(new Animated.Value(0.94)).current;
  const ring1Opacity = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(0.94)).current;
  const ring2Opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(scale, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.94, duration: 0, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    const anim1 = pulse(ring1Scale, ring1Opacity, 0);
    const anim2 = pulse(ring2Scale, ring2Opacity, 600);
    anim1.start();
    anim2.start();
    return () => { anim1.stop(); anim2.stop(); };
  }, []);

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[styles.ring1, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]}
        pointerEvents="none"
      />
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
