import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { T } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
  overflow?: 'hidden' | 'visible';
}

export function NeuCard({ children, style, borderRadius = 20, padding, overflow = 'hidden' }: Props) {
  return (
    <View style={[{ borderRadius }, style]}>
      {/* Light shadow — top-left */}
      <View style={[StyleSheet.absoluteFillObject, {
        borderRadius,
        backgroundColor: T.base,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: -4, height: -4 },
        shadowOpacity: 0.92,
        shadowRadius: 10,
      }]} pointerEvents="none" />
      {/* Dark shadow — bottom-right */}
      <View style={{
        borderRadius,
        backgroundColor: T.base,
        shadowColor: '#A3B1C6',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.75,
        shadowRadius: 14,
        elevation: 8,
        overflow,
        ...(padding !== undefined ? { padding } : {}),
      }}>
        {children}
      </View>
    </View>
  );
}
