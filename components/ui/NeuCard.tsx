import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { T } from '../../theme';
import { NEU_RAISED } from '../../constants/Shadows';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
  overflow?: 'hidden' | 'visible';
  pressed?: boolean;
}

export function NeuCard({ children, style, borderRadius = 20, padding, overflow = 'hidden', pressed = false }: Props) {
  if (pressed) {
    return (
      <View style={[{
        borderRadius,
        backgroundColor: '#E8EEF6',
        overflow: 'hidden',
        boxShadow: 'inset 5px 5px 14px rgba(143,163,188,0.6), inset -7px -7px 16px rgba(255,255,255,1)',
      } as any, style]}>
        <View style={{ borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius, overflow, ...(padding !== undefined ? { padding } : {}) }}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[{
      borderRadius,
      backgroundColor: T.base,
      boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
    } as any, style]}>
      <View style={{ borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius, overflow, ...(padding !== undefined ? { padding } : {}) }}>
        {children}
      </View>
    </View>
  );
}
