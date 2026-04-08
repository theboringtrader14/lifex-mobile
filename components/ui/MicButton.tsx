import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Rect, Path, Line } from 'react-native-svg';
import { T } from '../../theme';

interface Props { onPress: () => void; listening?: boolean }

export function MicButton({ onPress, listening = false }: Props) {
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.8)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse1 = Animated.loop(
      Animated.parallel([
        Animated.timing(ring1Scale, { toValue: 1.5, duration: 1800, useNativeDriver: true }),
        Animated.timing(ring1Opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    const pulse2 = Animated.loop(
      Animated.parallel([
        Animated.timing(ring2Scale, { toValue: 1.5, duration: 1800, useNativeDriver: true }),
        Animated.timing(ring2Opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    pulse1.start();
    const t = setTimeout(() => pulse2.start(), 600);
    return () => {
      clearTimeout(t);
      pulse1.stop();
      pulse2.stop();
    };
  }, []);

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 90, height: 90, borderRadius: 45,
          borderWidth: 2, borderColor: 'rgba(255,107,0,0.35)',
          transform: [{ scale: ring1Scale }],
          opacity: ring1Opacity,
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 110, height: 110, borderRadius: 55,
          borderWidth: 1.5, borderColor: 'rgba(255,107,0,0.2)',
          transform: [{ scale: ring2Scale }],
          opacity: ring2Opacity,
        }}
      />
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={styles.btnWrap as any}>
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
  btnWrap: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: '#E8EEF6',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },
});
