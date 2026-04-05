import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { theme, neuCard } from '../theme'

const categories = [
  { label: 'Trading Capital', value: '₹0', pct: 0, color: theme.orange },
  { label: 'Investments', value: '₹0', pct: 0, color: theme.green },
  { label: 'Savings', value: '₹0', pct: 0, color: theme.amber },
]

export default function NetWorthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NET WORTH</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[neuCard, styles.totalCard]}>
          <Text style={styles.totalLabel}>TOTAL NET WORTH</Text>
          <Text style={styles.totalValue}>₹0</Text>
        </View>
        {categories.map(c => (
          <View key={c.label} style={[neuCard, styles.catCard]}>
            <View style={styles.catRow}>
              <Text style={styles.catLabel}>{c.label}</Text>
              <Text style={[styles.catValue, { color: c.color }]}>{c.value}</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${c.pct}%` as any, backgroundColor: c.color }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '800', color: theme.orange, letterSpacing: 3, paddingHorizontal: 24, marginBottom: 20 },
  scroll: { padding: 20, gap: 12 },
  totalCard: { padding: 28, alignItems: 'center', marginBottom: 8 },
  totalLabel: { fontSize: 10, color: theme.textMuted, letterSpacing: 2, marginBottom: 12 },
  totalValue: { fontSize: 36, fontWeight: '800', color: theme.textPrimary },
  catCard: { padding: 20 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  catLabel: { fontSize: 13, color: theme.textPrimary, fontWeight: '600' },
  catValue: { fontSize: 15, fontWeight: '700', fontFamily: theme.fontMono },
  barBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },
})
