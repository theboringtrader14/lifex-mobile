import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { T } from '../../theme';

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
    // Inset style when pressed
    return (
      <View style={[{
        borderRadius,
        backgroundColor: '#D1D9E6',
        overflow: 'hidden',
        borderWidth: 1.5,
        borderTopColor: 'rgba(163,177,198,0.55)',
        borderLeftColor: 'rgba(163,177,198,0.55)',
        borderBottomColor: 'rgba(255,255,255,0.85)',
        borderRightColor: 'rgba(255,255,255,0.85)',
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

  return (
    <View style={[{ borderRadius }, style]}>
      {/* Light shadow layer — top-left (visible on iOS) */}
      <View style={[StyleSheet.absoluteFillObject, {
        borderRadius,
        backgroundColor: T.base,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.9,
        shadowRadius: 12,
      }]} pointerEvents="none" />
      {/* Dark shadow layer — bottom-right, carries border for Android light highlight */}
      <View style={{
        borderRadius,
        backgroundColor: T.base,
        shadowColor: '#A3B1C6',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.75,
        shadowRadius: 14,
        elevation: 6,
        borderWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.85)',
        borderLeftColor: 'rgba(255,255,255,0.85)',
        borderBottomColor: 'rgba(163,177,198,0.18)',
        borderRightColor: 'rgba(163,177,198,0.18)',
      }}>
        <View style={{
          borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius,
          overflow,
          ...(padding !== undefined ? { padding } : {}),
        }}>
          {children}
        </View>
      </View>
    </View>
  );
}
