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

export function NeuCard({
  children,
  style,
  borderRadius = 20,
  padding,
  overflow = 'hidden',
  pressed = false,
}: Props) {
  if (pressed) {
    return (
      <View
        style={[
          {
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
          },
          style,
        ]}
      >
        <View
          style={{
            borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius,
            overflow,
            ...(padding !== undefined ? { padding } : {}),
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  // Web: use boxShadow CSS property for both dark + light shadows
  const webShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            '7px 7px 16px rgba(143,163,188,0.75), -5px -5px 12px rgba(255,255,255,1)',
        } as any)
      : {};

  return (
    // Outer — dark shadow (iOS native or web CSS)
    <View
      style={[
        {
          borderRadius,
          backgroundColor: T.base,
          ...NEU_RAISED,
          ...webShadow,
        },
        style,
      ]}
    >
      {/* Inner — white highlight top-left border, NO overflow:hidden so border shows */}
      <View
        style={{
          borderRadius: borderRadius > 1 ? borderRadius - 1 : borderRadius,
          // IMPORTANT: overflow must be 'visible' here so top/left border renders
          overflow: 'visible',
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderTopColor: 'rgba(255,255,255,1)',
          borderLeftColor: 'rgba(255,255,255,1)',
          borderBottomWidth: 0,
          borderRightWidth: 0,
          ...(padding !== undefined ? { padding } : {}),
        }}
      >
        {/* Content wrapper — clips content properly without hiding the highlight */}
        <View
          style={{
            borderRadius: borderRadius > 2 ? borderRadius - 2 : borderRadius,
            overflow,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
