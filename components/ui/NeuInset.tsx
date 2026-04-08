import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
  overflow?: 'hidden' | 'visible';
}

export function NeuInset({ children, style, borderRadius = 20, padding, overflow = 'hidden' }: Props) {
  return (
    <View style={[{
      backgroundColor: '#E8EEF6',
      borderRadius,
      overflow,
      boxShadow: 'inset 5px 5px 14px rgba(143,163,188,0.6), inset -7px -7px 16px rgba(255,255,255,1)',
      ...(padding !== undefined ? { padding } : {}),
    } as any, style]}>
      {children}
    </View>
  );
}
