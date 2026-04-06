import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { NEU_INSET } from '../../constants/Shadows';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
  overflow?: 'hidden' | 'visible';
}

export function NeuInset({ children, style, borderRadius = 20, padding, overflow = 'hidden' }: Props) {
  const webShadow: any = Platform.OS === 'web'
    ? {
        boxShadow: 'inset 5px 5px 14px rgba(143,163,188,0.6), inset -7px -7px 16px rgba(255,255,255,1)',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      }
    : {};

  return (
    <View style={[{ ...NEU_INSET, borderRadius, overflow, ...webShadow, ...(padding !== undefined ? { padding } : {}) }, style]}>
      {children}
    </View>
  );
}
