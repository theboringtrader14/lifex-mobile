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
      backgroundColor: '#D1D9E6',
      overflow: 'hidden',
      borderWidth: 1.5,
      borderTopColor: 'rgba(163,177,198,0.55)',
      borderLeftColor: 'rgba(163,177,198,0.55)',
      borderBottomColor: 'rgba(255,255,255,0.88)',
      borderRightColor: 'rgba(255,255,255,0.88)',
      ...(padding !== undefined ? { padding } : {}),
    }, style]}>
      {/* Inner dark gradient — top edge */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 10,
        borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius,
        backgroundColor: 'rgba(163,177,198,0.18)',
      }} pointerEvents="none" />
      {/* Inner dark gradient — left edge */}
      <View style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 10,
        borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius,
        backgroundColor: 'rgba(163,177,198,0.12)',
      }} pointerEvents="none" />
      {/* Inner light gradient — bottom edge */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
        borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius,
        backgroundColor: 'rgba(255,255,255,0.55)',
      }} pointerEvents="none" />
      {/* Inner light gradient — right edge */}
      <View style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 8,
        borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius,
        backgroundColor: 'rgba(255,255,255,0.4)',
      }} pointerEvents="none" />
      {children}
    </View>
  );
}
