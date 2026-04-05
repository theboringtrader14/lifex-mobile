import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { NeumorphicCard } from './components/NeumorphicCard'
import { useStore } from './store/index'

export default function TradingScreen() {
  const { tradingPnl, fetch } = useStore()
  useEffect(() => { fetch() }, [])

  const stats = [
    { label: 'TODAY P&L',    value: `₹${tradingPnl}`, color: tradingPnl >= 0 ? '#22DD88' : '#FF4444' },
    { label: 'OPEN LOTS',    value: '0',   color: '#F0F0FF' },
    { label: 'ACTIVE ALGOS', value: '0',   color: '#FF6B00' },
    { label: 'WIN RATE',     value: '—',   color: '#FFB347' },
  ]

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>TRADING</Text>
        <View style={s.grid}>
          {stats.map(st => (
            <NeumorphicCard key={st.label} style={s.statCard}>
              <Text style={s.statLabel}>{st.label}</Text>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
            </NeumorphicCard>
          ))}
        </View>
        <NeumorphicCard style={s.empty}>
          <Text style={s.emptyText}>No open positions</Text>
          <Text style={s.emptyHint}>Market opens at 09:15 IST</Text>
        </NeumorphicCard>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#FF6B00', letterSpacing: 4, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  statCard: { width: '47%', padding: 20, alignItems: 'center' },
  statLabel: { fontSize: 9, color: 'rgba(232,232,248,0.4)', letterSpacing: 1.5, marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '800', fontFamily: 'Courier' },
  empty: { padding: 36, alignItems: 'center' },
  emptyText: { fontSize: 15, color: 'rgba(232,232,248,0.5)' },
  emptyHint: { fontSize: 11, color: 'rgba(232,232,248,0.25)', marginTop: 8 },
})
