import React from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { NeumorphicCard } from './components/NeumorphicCard'

const cats = [
  { label: 'Trading Capital', color: '#FF6B00', value: 0, pct: 0 },
  { label: 'Equity Portfolio', color: '#22DD88', value: 0, pct: 0 },
  { label: 'Savings',          color: '#FFB347', value: 0, pct: 0 },
  { label: 'Other Assets',     color: '#A78BFA', value: 0, pct: 0 },
]

export default function NetWorthScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>NET WORTH</Text>
        <NeumorphicCard style={s.hero}>
          <Text style={s.heroLabel}>TOTAL</Text>
          <Text style={s.heroValue}>₹0</Text>
          <Text style={s.heroSub}>Updated now</Text>
        </NeumorphicCard>
        {cats.map(c => (
          <NeumorphicCard key={c.label} style={s.card}>
            <View style={s.row}>
              <Text style={s.catLabel}>{c.label}</Text>
              <Text style={[s.catValue, { color: c.color }]}>₹{c.value.toLocaleString('en-IN')}</Text>
            </View>
            <View style={s.barBg}>
              <View style={[s.barFill, { width: `${c.pct}%` as any, backgroundColor: c.color }]} />
            </View>
          </NeumorphicCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#FF6B00', letterSpacing: 4, marginBottom: 8 },
  hero: { padding: 32, alignItems: 'center', marginBottom: 4 },
  heroLabel: { fontSize: 9, color: 'rgba(232,232,248,0.4)', letterSpacing: 2, marginBottom: 12 },
  heroValue: { fontSize: 42, fontWeight: '800', color: '#F0F0FF', fontFamily: 'Courier' },
  heroSub: { fontSize: 10, color: 'rgba(232,232,248,0.3)', marginTop: 8 },
  card: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  catLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(232,232,248,0.85)' },
  catValue: { fontSize: 15, fontWeight: '700', fontFamily: 'Courier' },
  barBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },
})
