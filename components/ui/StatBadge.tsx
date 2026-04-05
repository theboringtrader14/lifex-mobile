import React from 'react';
import { View, Text } from 'react-native';
import { T } from '../../theme';

interface Props { label: string; color?: string }

export function StatBadge({ label, color = T.orange }: Props) {
  return (
    <View style={{
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 30,
      backgroundColor: color + '1F',
    }}>
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.6, color, textTransform: 'uppercase', fontFamily: T.fontDisplay }}>
        {label}
      </Text>
    </View>
  );
}
