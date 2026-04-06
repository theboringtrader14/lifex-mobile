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
        backgroundColor: '#D1DCE8',
        overflow: 'hidden',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderTopColor: 'rgba(143,163,188,0.9)',
        borderLeftColor: 'rgba(143,163,188,0.9)',
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderBottomColor: 'rgba(255,255,255,1)',
        borderRightColor: 'rgba(255,255,255,1)',
      }, style]}>
        <View style={{
          borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius,
          overflow,
          ...(padding !== undefined ? { padding } : {}),
        }}>
          {children}
        </View>
      </View>
    );
  }

  const webShadow: any = Platform.OS === 'web'
    ? { boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)' }
    : {};

  return (
    <View style={[{
      borderRadius,
      backgroundColor: T.base,
      ...NEU_RAISED,
      ...webShadow,
    }, style]}>
      <View style={{
        borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        overflow,
        ...(padding !== undefined ? { padding } : {}),
      }}>
        {children}
      </View>
    </View>
  );
}
