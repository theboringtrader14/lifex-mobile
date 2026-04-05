import React from 'react';
import { View, ViewStyle } from 'react-native';
import { T } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
}

export function NeuInset({ children, style, borderRadius = 20, padding }: Props) {
  return (
    <View style={[{
      borderRadius,
      backgroundColor: '#D8E0ED',
      borderWidth: 1.5,
      borderTopColor: T.shadowDI,
      borderLeftColor: T.shadowDI,
      borderBottomColor: T.shadowLI,
      borderRightColor: T.shadowLI,
      overflow: 'hidden',
      ...(padding !== undefined ? { padding } : {}),
    }, style]}>
      {/* Inner dark shadow top-left */}
      <View style={{
        position: 'absolute', top: -8, left: -8, width: '120%', height: '120%',
        borderRadius: borderRadius + 8,
        backgroundColor: 'transparent',
        shadowColor: '#A3B1C6',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      }} pointerEvents="none" />
      {/* Inner light shadow bottom-right */}
      <View style={{
        position: 'absolute', bottom: -8, right: -8, width: '120%', height: '120%',
        borderRadius: borderRadius + 8,
        backgroundColor: 'transparent',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: -3, height: -3 },
        shadowOpacity: 0.85,
        shadowRadius: 8,
      }} pointerEvents="none" />
      {children}
    </View>
  );
}
