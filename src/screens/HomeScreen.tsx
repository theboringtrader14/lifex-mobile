import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import axios from 'axios'
import { theme, neuCard, neuButton } from '../theme'

const API = 'http://localhost:8000'
const { width } = Dimensions.get('window')

interface DashboardData {
  net_pnl?: number
  open_positions?: number
  active_algos?: number
}

export default function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<DashboardData>({})
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    axios.get(`${API}/api/v1/mobile/dashboard`)
      .then(r => setData(r.data))
      .catch(() => {})
  }, [])

  const widgets = [
    { label: 'NET P&L', value: `₹${(data.net_pnl ?? 0).toLocaleString('en-IN')}`, color: (data.net_pnl ?? 0) >= 0 ? theme.green : theme.red, screen: 'Trading' },
    { label: 'OPEN POSITIONS', value: String(data.open_positions ?? 0), color: theme.orange, screen: 'Trading' },
    { label: 'ACTIVE ALGOS', value: String(data.active_algos ?? 0), color: theme.amber, screen: 'Trading' },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LIFEX</Text>
        <Text style={styles.subtitle}>Intelligence Suite</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Widget row */}
        <View style={styles.widgetRow}>
          {widgets.map(w => (
            <TouchableOpacity key={w.label} style={[neuCard, styles.widget]} onPress={() => navigation.navigate(w.screen)}>
              <Text style={styles.widgetLabel}>{w.label}</Text>
              <Text style={[styles.widgetValue, { color: w.color }]}>{w.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick nav cards */}
        {['Trading', 'NetWorth', 'Budget'].map(screen => (
          <TouchableOpacity key={screen} style={[neuCard, styles.navCard]} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.navCardLabel}>{screen.toUpperCase()}</Text>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Transcript display */}
        {transcript ? (
          <View style={[neuCard, styles.transcriptCard]}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Neumorphic mic button */}
      <View style={styles.micWrapper}>
        <TouchableOpacity
          style={[neuButton, styles.micButton, listening && styles.micActive]}
          onPress={() => {
            setListening(l => !l)
            if (listening) {
              setTranscript('Voice input — connect @react-native-voice/voice for live STT')
              setListening(false)
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.micIcon}>{listening ? '⏹' : '🎙'}</Text>
        </TouchableOpacity>
        <Text style={styles.micHint}>{listening ? 'Listening...' : 'Tap to speak'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  logo: { fontSize: 28, fontWeight: '800', color: theme.orange, letterSpacing: 4 },
  subtitle: { fontSize: 12, color: theme.textMuted, letterSpacing: 2, marginTop: 2 },
  scroll: { padding: 20, paddingBottom: 120 },
  widgetRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  widget: { flex: 1, padding: 16, alignItems: 'center' },
  widgetLabel: { fontSize: 9, color: theme.textMuted, letterSpacing: 1.5, marginBottom: 8 },
  widgetValue: { fontSize: 20, fontWeight: '700', fontFamily: theme.fontMono },
  navCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginBottom: 12 },
  navCardLabel: { fontSize: 13, fontWeight: '700', color: theme.textPrimary, letterSpacing: 2 },
  navArrow: { fontSize: 24, color: theme.orange },
  transcriptCard: { padding: 16, marginTop: 12 },
  transcriptText: { color: theme.textPrimary, fontSize: 14, lineHeight: 20 },
  micWrapper: { position: 'absolute', bottom: 40, alignSelf: 'center', alignItems: 'center' },
  micButton: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  micActive: { borderWidth: 2, borderColor: theme.orange },
  micIcon: { fontSize: 32 },
  micHint: { marginTop: 8, fontSize: 11, color: theme.textMuted, letterSpacing: 1 },
})
