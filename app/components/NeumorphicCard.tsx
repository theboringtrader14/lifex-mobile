import React from 'react'
import { View, ViewStyle, StyleSheet } from 'react-native'

interface Props {
  children: React.ReactNode
  style?: ViewStyle
  variant?: 'raised' | 'flat' | 'inset'
}

export function NeumorphicCard({ children, style, variant = 'raised' }: Props) {
  return (
    <View style={[styles.base, variant === 'inset' && styles.inset, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#1E1E35',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  inset: {
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: '#191930',
  },
})
