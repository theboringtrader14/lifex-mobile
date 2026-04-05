import React from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { NeumorphicCard } from './components/NeumorphicCard'

const cats = [
  { label: 'Food & Dining',  icon: '🍜', spent: 0, budget: 15000, color: '#FF6B00' },
  { label: 'Transport',      icon: '🚗', spent: 0, budget: 5000,  color: '#FFB347' },
  { label: 'Entertainment',  icon: '🎬', spent: 0, budget: 3000,  color: '#A78BFA' },
  { label: 'Utilities',      icon: '⚡', spent: 0, budget: 8000,  color: '#22DD88' },
  { label: 'Subscriptions',  icon: '📱', spent: 0, budget: 2000,  color: '#60A5FA' },
]

export default function BudgetScreen() {
  const totalSpent  = cats.reduce((a, c) => a + c.spent, 0)
  const totalBudget = cats.reduce((a, c) => a + c.budget, 0)

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>BUDGET</Text>
        <NeumorphicCard style={s.summary}>
          <View style={s.summaryRow}>
            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>SPENT</Text>
              <Text style={[s.summaryVal, { color: '#FF4444' }]}>₹{totalSpent.toLocaleString('en-IN')}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>REMAINING</Text>
              <Text style={[s.summaryVal, { color: '#22DD88' }]}>₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </NeumorphicCard>
        {cats.map(c => {
          const pct = Math.min((c.spent / c.budget) * 100, 100)
          return (
            <NeumorphicCard key={c.label} style={s.card}>
              <View style={s.cardRow}>
                <Text style={s.icon}>{c.icon}</Text>
                <Text style={s.catLabel}>{c.label}</Text>
                <Text style={[s.catAmt, { color: c.color }]}>₹{c.spent.toLocaleString('en-IN')}</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${pct}%` as any, backgroundColor: c.color }]} />
              </View>
              <Text style={s.limit}>Budget: ₹{c.budget.toLocaleString('en-IN')}</Text>
            </NeumorphicCard>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#FF6B00', letterSpacing: 4, marginBottom: 8 },
  summary: { padding: 24, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 9, color: 'rgba(232,232,248,0.4)', letterSpacing: 2, marginBottom: 10 },
  summaryVal: { fontSize: 28, fontWeight: '800', fontFamily: 'Courier' },
  divider: { width: 0.5, height: 44, backgroundColor: 'rgba(255,255,255,0.1)' },
  card: { padding: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  icon: { fontSize: 20 },
  catLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: 'rgba(232,232,248,0.85)' },
  catAmt: { fontSize: 14, fontWeight: '700', fontFamily: 'Courier' },
  barBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 6 },
  barFill: { height: 4, borderRadius: 2 },
  limit: { fontSize: 10, color: 'rgba(232,232,248,0.25)' },
})
