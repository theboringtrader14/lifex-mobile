import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Dimensions
} from 'react-native'
import { router } from 'expo-router'
import * as Speech from 'expo-speech'
import { NeumorphicCard } from './components/NeumorphicCard'
import { MicButton } from './components/MicButton'
import { useStore } from './store/index'

const { width } = Dimensions.get('window')
const WIDGET_W = (width - 48 - 16) / 3

function fmt(n: number, prefix = '₹') {
  if (Math.abs(n) >= 100000) return `${prefix}${(n / 100000).toFixed(1)}L`
  if (Math.abs(n) >= 1000)   return `${prefix}${(n / 1000).toFixed(1)}k`
  return `${prefix}${n}`
}

export default function HomeScreen() {
  const { netWorth, tradingPnl, expenses, fetch } = useStore()
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  useEffect(() => { fetch() }, [])

  const widgets = [
    { label: 'NET WORTH',   value: fmt(netWorth),   color: '#F0F0FF',  sub: 'total assets', route: '/networth' },
    { label: 'TRADING P&L', value: fmt(tradingPnl), color: tradingPnl >= 0 ? '#22DD88' : '#FF4444', sub: 'today', route: '/trading' },
    { label: 'EXPENSES',    value: fmt(expenses),   color: '#FFB347',  sub: 'this month', route: '/budget' },
  ]

  const handleMic = async () => {
    if (listening) {
      setListening(false)
      const stub = 'Show me today\'s P&L'
      setTranscript(stub)
      Speech.speak('Today\'s trading P&L is ' + fmt(tradingPnl), { rate: 0.95 })
    } else {
      setListening(true)
      setTranscript('')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>LIFEX</Text>
          <Text style={styles.tagline}>Intelligence Suite</Text>
        </View>

        {/* Widget row */}
        <View style={styles.widgetRow}>
          {widgets.map(w => (
            <TouchableOpacity key={w.label} onPress={() => router.push(w.route as any)} activeOpacity={0.85}>
              <NeumorphicCard style={styles.widget}>
                <Text style={styles.widgetLabel}>{w.label}</Text>
                <Text style={[styles.widgetValue, { color: w.color }]}>{w.value}</Text>
                <Text style={styles.widgetSub}>{w.sub}</Text>
              </NeumorphicCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIFEX AI section */}
        <NeumorphicCard style={styles.aiCard}>
          <Text style={styles.aiTitle}>LIFEX AI</Text>
          <Text style={styles.aiSub}>Voice Intelligence</Text>
          {transcript ? (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            </View>
          ) : null}
          <View style={styles.micArea}>
            <MicButton listening={listening} onPress={handleMic} />
          </View>
        </NeumorphicCard>

        {/* Quick links */}
        <View style={styles.quickLinks}>
          {[
            { label: 'TRADING', icon: '📈', route: '/trading' },
            { label: 'NET WORTH', icon: '💎', route: '/networth' },
            { label: 'BUDGET', icon: '💰', route: '/budget' },
          ].map(item => (
            <TouchableOpacity key={item.label} onPress={() => router.push(item.route as any)} activeOpacity={0.8}>
              <NeumorphicCard style={styles.quickCard}>
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
                <Text style={styles.quickArrow}>›</Text>
              </NeumorphicCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24, paddingTop: 8 },
  logo: { fontSize: 30, fontWeight: '800', color: '#FF6B00', letterSpacing: 6 },
  tagline: { fontSize: 11, color: 'rgba(232,232,248,0.4)', letterSpacing: 3, marginTop: 2 },
  widgetRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  widget: { width: WIDGET_W, padding: 14, alignItems: 'center' },
  widgetLabel: { fontSize: 8, color: 'rgba(232,232,248,0.4)', letterSpacing: 1.5, marginBottom: 10, textAlign: 'center' },
  widgetValue: { fontSize: 18, fontWeight: '800', fontFamily: 'Courier', marginBottom: 4 },
  widgetSub: { fontSize: 9, color: 'rgba(232,232,248,0.3)', letterSpacing: 1 },
  aiCard: { padding: 28, alignItems: 'center', marginBottom: 20 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: '#FF6B00', letterSpacing: 4, marginBottom: 4 },
  aiSub: { fontSize: 10, color: 'rgba(232,232,248,0.35)', letterSpacing: 2, marginBottom: 20 },
  transcriptBox: { backgroundColor: 'rgba(255,107,0,0.08)', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 0.5, borderColor: 'rgba(255,107,0,0.2)' },
  transcriptText: { color: 'rgba(232,232,248,0.85)', fontSize: 14, fontStyle: 'italic', lineHeight: 20, textAlign: 'center' },
  micArea: { paddingVertical: 20 },
  quickLinks: { gap: 10 },
  quickCard: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  quickIcon: { fontSize: 22 },
  quickLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: 'rgba(232,232,248,0.85)', letterSpacing: 2 },
  quickArrow: { fontSize: 22, color: '#FF6B00' },
})
