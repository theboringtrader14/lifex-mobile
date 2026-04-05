import React from 'react';
import { Text, TextStyle } from 'react-native';
import { T } from '../../theme';

interface Props { label: string; style?: TextStyle }

export function SectionLabel({ label, style }: Props) {
  return (
    <Text style={[{
      fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
      color: T.textS, textTransform: 'uppercase',
      paddingHorizontal: 24, paddingTop: 14, paddingBottom: 6,
      fontFamily: T.fontDisplay,
    }, style]}>
      {label}
    </Text>
  );
}
