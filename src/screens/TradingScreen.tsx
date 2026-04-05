import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { theme, neuCard } from '../theme'

export default function TradingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRADING</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[neuCard, styles.card]}>
          <Text style={styles.label}>TODAY P&L</Text>
          <Text style={[styles.value, { color: theme.green }]}>+₹0</Text>
        </View>
        <View style={[neuCard, styles.card]}>
          <Text style={styles.label}>ACTIVE ALGOS</Text>
          <Text style={styles.value}>0</Text>
        </View>
        <View style={[neuCard, styles.card]}>
          <Text style={styles.label}>OPEN POSITIONS</Text>
          <Text style={styles.value}>0</Text>
        </View>
        <View style={[neuCard, styles.emptyState]}>
          <Text style={styles.emptyText}>No open positions</Text>
          <Text style={styles.emptyHint}>Algos will appear here during market hours</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '800', color: theme.orange, letterSpacing: 3, paddingHorizontal: 24, marginBottom: 20 },
  scroll: { padding: 20, gap: 12 },
  card: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 10, color: theme.textMuted, letterSpacing: 1.5 },
  value: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, fontFamily: theme.fontMono },
  emptyState: { padding: 32, alignItems: 'center', marginTop: 8 },
  emptyText: { color: theme.textMuted, fontSize: 15 },
  emptyHint: { color: theme.textMuted, fontSize: 12, marginTop: 8, opacity: 0.6 },
})
