import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { MicButton } from '../../components/ui/MicButton';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function ArrowIcon() {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8" fill="none">
      <Path d="M1.5 6.5L6.5 1.5M6.5 1.5H3M6.5 1.5V5" stroke={T.textS} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  );
}

const WIDGETS = [
  { color: T.teal, label: 'NET WORTH', value: '₹47.1L', sub: '+0.5% today', subColor: T.teal, route: '/portfolio' },
  { color: T.orange, label: 'TRADING', value: '+₹294', sub: 'FY P&L', subColor: T.textM, route: '/trading' },
  { color: T.purple, label: 'BUDGET', value: '₹18.4K', sub: 'this month', subColor: T.textM, route: '/budget' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.base }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.hdr}>
        <View>
          <Text style={s.greeting}>Good morning,</Text>
          <Text style={s.name}>Karthik</Text>
        </View>
        <View style={s.avatar}>
          <Text style={s.avatarText}>K</Text>
        </View>
      </View>

      <SectionLabel label="OVERVIEW" />

      {/* Widget cards */}
      <View style={s.widgetRow}>
        {WIDGETS.map((w) => (
          <TouchableOpacity key={w.label} style={{ flex: 1 }} onPress={() => router.push(w.route as any)} activeOpacity={0.85}>
            <NeuCard style={{ flex: 1 }} borderRadius={20} overflow="hidden">
              {/* Accent bar */}
              <View style={[s.accent, { backgroundColor: w.color }]} />
              <View style={{ paddingTop: 14, paddingHorizontal: 12, paddingBottom: 32 }}>
                <View style={[s.dot, { backgroundColor: w.color }]} />
                <Text style={s.wLbl}>{w.label}</Text>
                <Text style={s.wVal}>{w.value}</Text>
                <Text style={[s.wSub, { color: w.subColor }]}>{w.sub}</Text>
              </View>
              {/* Arrow circle */}
              <View style={s.arrowCircle}>
                <ArrowIcon />
              </View>
            </NeuCard>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats strip */}
      <NeuCard style={s.statsStrip} borderRadius={20} overflow="hidden">
        {[
          { num: '21', lbl: 'ACTIVE ALGOS', color: T.textH },
          { num: '0', lbl: 'OPEN POS.', color: T.textH },
          { num: '₹0', lbl: 'TODAY P&L', color: T.teal },
        ].map((stat, i) => (
          <React.Fragment key={stat.lbl}>
            {i > 0 && <View style={s.divider} />}
            <View style={s.statItem}>
              <Text style={[s.statNum, { color: stat.color }]}>{stat.num}</Text>
              <Text style={s.statLbl}>{stat.lbl}</Text>
            </View>
          </React.Fragment>
        ))}
      </NeuCard>

      <SectionLabel label="LIFEX AI" style={{ marginTop: 14 }} />

      {/* Voice section */}
      <View style={s.voiceWrap}>
        <View style={s.voiceBoxOuter}>
          <NeuInset style={s.voiceBox}>
            <Text style={s.voiceHint}>LISTENING…</Text>
            <Text style={s.voiceText}>Which algo performed best this week?</Text>
          </NeuInset>
          {/* Mic button absolutely anchored at bottom of voice box, overhanging by 33px */}
          <View style={s.micAnchor}>
            <MicButton onPress={() => {}} listening />
          </View>
        </View>
        <Text style={s.tapHint}>TAP TO SPEAK TO LIFEX AI</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  greeting: { fontSize: 12, color: T.textM, fontFamily: 'Syne_400Regular' },
  name: { fontSize: 22, fontWeight: '800', color: T.textH, letterSpacing: -0.5, fontFamily: 'Syne_800ExtraBold' },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: T.orange, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#A3B1C6', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.75, shadowRadius: 10, elevation: 5,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#FFF', fontFamily: 'Syne_700Bold' },
  widgetRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  accent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginBottom: 8 },
  wLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.textS, marginBottom: 3, fontFamily: 'Syne_700Bold' },
  wVal: { fontSize: 15, fontWeight: '600', color: T.textH, letterSpacing: -0.5, fontFamily: 'JetBrainsMono_600SemiBold', marginBottom: 2 },
  wSub: { fontSize: 9, fontWeight: '500', fontFamily: 'Syne_400Regular' },
  arrowCircle: {
    position: 'absolute', bottom: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: T.base, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#A3B1C6', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.75, shadowRadius: 5, elevation: 3,
  },
  statsStrip: { flexDirection: 'row', marginHorizontal: 16, marginTop: 14, paddingVertical: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 20, fontWeight: '600', marginBottom: 4 },
  statLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: T.textS, fontFamily: 'Syne_700Bold' },
  divider: { width: 1, backgroundColor: 'rgba(163,177,198,0.4)', marginVertical: '12%' },
  voiceWrap: { paddingHorizontal: 16, alignItems: 'center' },
  voiceBoxOuter: { width: '100%', position: 'relative', marginBottom: 33 },
  voiceBox: { width: '100%', paddingTop: 18, paddingHorizontal: 20, paddingBottom: 64, minHeight: 130 },
  voiceHint: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.textS, marginBottom: 10, fontFamily: 'Syne_700Bold' },
  voiceText: { fontSize: 14, color: T.textB, lineHeight: 22, fontStyle: 'italic', fontFamily: 'Syne_400Regular' },
  micAnchor: { position: 'absolute', bottom: -33, left: 0, right: 0, alignItems: 'center' },
  tapHint: { marginTop: 40, fontSize: 10, color: T.textS, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600', fontFamily: 'Syne_700Bold' },
});
