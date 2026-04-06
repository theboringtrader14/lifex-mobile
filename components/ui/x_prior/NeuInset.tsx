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

export function NeuInset({
  children,
  style,
  borderRadius = 20,
  padding,
  overflow = 'hidden',
}: Props) {
  const webShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            'inset 5px 5px 12px rgba(143,163,188,0.8), inset -4px -4px 10px rgba(255,255,255,1)',
        } as any)
      : {};

  return (
    <View
      style={[
        {
          ...NEU_INSET,
          borderRadius,
          overflow,
          ...webShadow,
          ...(padding !== undefined ? { padding } : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
