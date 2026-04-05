import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { theme, neuCard } from '../theme'

const categories = [
  { label: 'Food & Dining', icon: '🍜', spent: 0, budget: 15000, color: theme.orange },
  { label: 'Transport', icon: '🚗', spent: 0, budget: 5000, color: theme.amber },
  { label: 'Entertainment', icon: '🎬', spent: 0, budget: 3000, color: '#A78BFA' },
  { label: 'Utilities', icon: '⚡', spent: 0, budget: 8000, color: theme.green },
]

export default function BudgetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BUDGET</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[neuCard, styles.summaryCard]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>SPENT</Text>
              <Text style={[styles.summaryValue, { color: theme.red }]}>₹0</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>REMAINING</Text>
              <Text style={[styles.summaryValue, { color: theme.green }]}>₹0</Text>
            </View>
          </View>
        </View>
        {categories.map(c => {
          const pct = Math.min((c.spent / c.budget) * 100, 100)
          return (
            <View key={c.label} style={[neuCard, styles.catCard]}>
              <View style={styles.catHeader}>
                <Text style={styles.catIcon}>{c.icon}</Text>
                <Text style={styles.catLabel}>{c.label}</Text>
                <Text style={[styles.catAmount, { color: c.color }]}>₹{c.spent.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: c.color }]} />
              </View>
              <Text style={styles.catLimit}>of ₹{c.budget.toLocaleString('en-IN')}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '800', color: theme.orange, letterSpacing: 3, paddingHorizontal: 24, marginBottom: 20 },
  scroll: { padding: 20, gap: 12 },
  summaryCard: { padding: 24, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 9, color: theme.textMuted, letterSpacing: 2, marginBottom: 8 },
  summaryValue: { fontSize: 26, fontWeight: '800', fontFamily: theme.fontMono },
  summaryDivider: { width: 0.5, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  catCard: { padding: 20 },
  catHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  catIcon: { fontSize: 20, marginRight: 10 },
  catLabel: { flex: 1, fontSize: 13, color: theme.textPrimary, fontWeight: '600' },
  catAmount: { fontSize: 15, fontWeight: '700', fontFamily: theme.fontMono },
  barBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 6 },
  barFill: { height: 4, borderRadius: 2 },
  catLimit: { fontSize: 10, color: theme.textMuted },
})
