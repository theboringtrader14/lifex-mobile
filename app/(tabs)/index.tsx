import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { MicButton } from '../../components/ui/MicButton';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHomeDashboard, getPortfolioSummary, getBudgetSummary } from '../../src/services/api';

const { width } = Dimensions.get('window');

function ArrowIcon() {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8" fill="none">
      <Path d="M1.5 6.5L6.5 1.5M6.5 1.5H3M6.5 1.5V5" stroke={T.textS} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  );
}

function WidgetCard({ w }: { w: { color: string; label: string; value: string; sub: string; subColor: string; route: string } }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Pressable
      style={{ flex: 1 }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => router.push(w.route as any)}
    >
      <NeuCard style={{ flex: 1 }} borderRadius={20} overflow="hidden" pressed={pressed}>
        <View style={[s.accent, { backgroundColor: w.color }]} />
        <View style={{ paddingTop: 14, paddingHorizontal: 12, paddingBottom: 32 }}>
          <View style={[s.dot, { backgroundColor: w.color }]} />
          <Text style={s.wLbl}>{w.label}</Text>
          <Text style={s.wVal}>{w.value}</Text>
          <Text style={[s.wSub, { color: w.subColor }]}>{w.sub}</Text>
        </View>
        <View style={s.arrowCircle}>
          <ArrowIcon />
        </View>
      </NeuCard>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [dashboard, setDashboard] = useState<any>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<any>(null);
  const [budgetSummary, setBudgetSummary] = useState<any>(null);

  useEffect(() => {
    getHomeDashboard().then(setDashboard).catch(() => {});
    getPortfolioSummary().then(setPortfolioSummary).catch(() => {});
    getBudgetSummary().then(setBudgetSummary).catch(() => {});
  }, []);

  const formatPnl = (val: number | undefined) => {
    if (val === undefined || val === null) return '...';
    const sign = val >= 0 ? '+' : '';
    if (Math.abs(val) >= 100000) return `${sign}₹${(val / 100000).toFixed(1)}L`;
    if (Math.abs(val) >= 1000) return `${sign}₹${(val / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(val)}`;
  };
  const formatValue = (val: number | undefined) => {
    if (val === undefined || val === null) return '...';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${Math.round(val)}`;
  };

  const widgets = [
    { color: T.teal, label: 'NET WORTH', value: formatValue(portfolioSummary?.total_value), sub: '+0.5% today', subColor: T.teal, route: '/portfolio' },
    { color: T.orange, label: 'TRADING', value: formatPnl(dashboard?.fy_pnl), sub: 'FY P&L', subColor: T.textM, route: '/trading' },
    { color: T.purple, label: 'BUDGET', value: formatValue(budgetSummary?.monthly_total), sub: 'this month', subColor: T.textM, route: '/budget' },
  ];

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
        {widgets.map((w) => <WidgetCard key={w.label} w={w} />)}
      </View>

      {/* Stats strip */}
      <NeuCard style={{ marginHorizontal: 16, marginTop: 14 }} borderRadius={20} overflow="hidden">
        <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: T.textH }]}>{dashboard?.active_algos ?? '...'}</Text>
            <Text style={s.statLbl}>ACTIVE ALGOS</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(163,177,198,0.45)', marginVertical: 14 }} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: T.textH }]}>{dashboard?.open_positions ?? '...'}</Text>
            <Text style={s.statLbl}>OPEN POS.</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(163,177,198,0.45)', marginVertical: 14 }} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: T.teal }]}>{dashboard ? formatPnl(dashboard.today_pnl) : '...'}</Text>
            <Text style={s.statLbl}>TODAY P&L</Text>
          </View>
        </View>
      </NeuCard>

      <SectionLabel label="LIFEX AI" style={{ marginTop: 14 }} />

      {/* Voice section */}
      <View style={s.voiceWrap}>
        <NeuInset style={s.voiceBox} borderRadius={24} overflow="visible">
          <Text style={s.voiceHint}>SAY YOUR EXPENSE…</Text>
          <Text style={s.voiceText}>e.g. "Swiggy 350 food"</Text>
        </NeuInset>
        {/* Mic — half overlaps bottom of container */}
        <View style={s.micAnchor}>
          <MicButton onPress={() => {}} listening />
        </View>
        <Text style={s.tapHint}>TAP MIC TO RECORD EXPENSE</Text>
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
  statsStrip: { marginHorizontal: 16, marginTop: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 20, fontWeight: '600', marginBottom: 4 },
  statLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: T.textS, fontFamily: 'Syne_700Bold' },
  voiceWrap: { paddingHorizontal: 16, alignItems: 'center', marginBottom: 16 },
  voiceBox: { width: '100%', padding: 20, paddingBottom: 60, minHeight: 220 },
  micAnchor: { marginTop: -38, zIndex: 10 },
  voiceHint: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.textS, marginBottom: 10, fontFamily: 'Syne_700Bold' },
  voiceText: { fontSize: 14, color: T.textB, lineHeight: 22, fontStyle: 'italic', fontFamily: 'Syne_400Regular' },
  tapHint: { marginTop: 18, fontSize: 10, color: T.textS, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '700', fontFamily: 'Syne_700Bold' },
});
