import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPortfolio, getPortfolioSummary } from '../../src/services/api';

const CHART_PATH = 'M0 90 C20 85 40 80 70 75 S110 65 140 55 S190 35 230 28 S290 20 340 10 L340 110 L0 110 Z';
const CHART_LINE = 'M0 90 C20 85 40 80 70 75 S110 65 140 55 S190 35 230 28 S290 20 340 10';

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();

  const [summary, setSummary] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);

  useEffect(() => {
    getPortfolioSummary().then(setSummary).catch(() => {});
    getPortfolio().then(d => setHoldings(Array.isArray(d) ? d : d?.holdings ?? [])).catch(() => {});
  }, []);

  const formatValue = (val: number | undefined) => {
    if (val === undefined || val === null) return '...';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${Math.round(val)}`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.base }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={T.textB} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>NET WORTH</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.hero}>
        <Text style={s.heroLbl}>TOTAL</Text>
        <Text style={s.heroVal}>{summary ? formatValue(summary.total_value) : '...'}</Text>
        <Text style={s.heroGain}>{summary ? `▲ ${summary.total_gain_pct?.toFixed(2) ?? '0.00'}% overall` : '▲ ...'}</Text>
      </View>

      {/* Equity curve */}
      <NeuInset style={s.chartBox} borderRadius={20}>
        <Svg width="100%" height={110} viewBox="0 0 340 110" preserveAspectRatio="none">
          <Defs>
            <SvgLinearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={T.teal} stopOpacity={0.25} />
              <Stop offset="1" stopColor={T.teal} stopOpacity={0.02} />
            </SvgLinearGradient>
          </Defs>
          <Path d={CHART_PATH} fill="url(#tealGrad)" />
          <Path d={CHART_LINE} fill="none" stroke={T.teal} strokeWidth={1.8} />
        </Svg>
      </NeuInset>

      <SectionLabel label="BREAKDOWN" style={{ marginTop: 16 }} />
      {[
        { emoji: '📈', name: 'Equity Portfolio', sub: '37 stocks · Zerodha + AO', val: '₹46.8L' },
        { emoji: '💼', name: 'Mutual Funds', sub: '9 funds · Zerodha Coin', val: '₹0' },
        { emoji: '🏦', name: 'Cash / Bank', sub: 'Manual entry', val: '—' },
      ].map((a) => (
        <NeuCard key={a.name} style={s.assetCard} borderRadius={20} padding={0}>
          <View style={s.assetRow}>
            <View style={s.assetLeft}>
              <View style={s.assetIcon}><Text style={{ fontSize: 16 }}>{a.emoji}</Text></View>
              <View>
                <Text style={s.assetName}>{a.name}</Text>
                <Text style={s.assetSub}>{a.sub}</Text>
              </View>
            </View>
            <Text style={s.assetVal}>{a.val}</Text>
          </View>
        </NeuCard>
      ))}

      <SectionLabel label="TOP HOLDINGS" style={{ marginTop: 16 }} />
      <NeuCard style={s.holdingsCard} borderRadius={20} overflow="hidden">
        {[
          { ticker: 'JSWSTEEL', val: '₹2.8L', pct: '+32%' },
          { ticker: 'MAZDOCK', val: '₹1.9L', pct: '+206%' },
          { ticker: 'TATAPOWER', val: '₹1.9L', pct: '+12%' },
        ].map((h, i) => (
          <React.Fragment key={h.ticker}>
            {i > 0 && <View style={s.rowDiv} />}
            <View style={s.holdingRow}>
              <Text style={s.holdingTicker}>{h.ticker}</Text>
              <Text style={s.holdingVal}>{h.val}</Text>
              <Text style={s.holdingPct}>{h.pct}</Text>
            </View>
          </React.Fragment>
        ))}
      </NeuCard>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backTxt: { fontSize: 13, fontWeight: '600', color: T.textB, fontFamily: 'Syne_700Bold' },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 32, fontWeight: '700', color: T.textH, letterSpacing: -1 },
  heroGain: { fontSize: 13, color: T.green, fontWeight: '600', marginTop: 4, fontFamily: 'Syne_700Bold' },
  chartBox: {
    marginHorizontal: 16, borderRadius: 20, overflow: 'hidden',
    height: 90, padding: 8, paddingHorizontal: 12, paddingBottom: 4,
    backgroundColor: '#D1DCE8',
    borderTopWidth: 2, borderLeftWidth: 2,
    borderTopColor: 'rgba(143,163,188,0.9)', borderLeftColor: 'rgba(143,163,188,0.9)',
    borderBottomWidth: 2, borderRightWidth: 2,
    borderBottomColor: 'rgba(255,255,255,1)', borderRightColor: 'rgba(255,255,255,1)',
  },
  assetCard: { marginHorizontal: 16, marginBottom: 10 },
  assetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 16 },
  assetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assetIcon: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.base, shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.75, shadowRadius: 7, elevation: 4,
  },
  assetName: { fontSize: 13, fontWeight: '600', color: T.textH, fontFamily: 'Syne_700Bold' },
  assetSub: { fontSize: 10, color: T.textM, marginTop: 2, fontFamily: 'Syne_400Regular' },
  assetVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 14, fontWeight: '600', color: T.textH },
  holdingsCard: { marginHorizontal: 16, marginBottom: 10 },
  rowDiv: { height: 1, backgroundColor: 'rgba(163,177,198,0.25)', marginHorizontal: 0 },
  holdingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 10 },
  holdingTicker: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13, fontWeight: '600', color: T.textH, flex: 1 },
  holdingVal: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: T.textB, flex: 1, textAlign: 'center' },
  holdingPct: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, fontWeight: '600', color: T.green, flex: 1, textAlign: 'right' },
});
