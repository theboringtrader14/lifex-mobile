import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Circle, Line, Polyline } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPortfolio, getPortfolioSummary } from '../../src/services/api';

const CHART_PATH = 'M0 90 C20 85 40 80 70 75 S110 65 140 55 S190 35 230 28 S290 20 340 10 L340 110 L0 110 Z';
const CHART_LINE = 'M0 90 C20 85 40 80 70 75 S110 65 140 55 S190 35 230 28 S290 20 340 10';


function AssetIcon({ emoji }: { emoji: string }) {
  const color = T.orange;
  const size = 20;
  if (emoji === '📈') {
    // Trend line with upward arrow
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Polyline points="3,17 9,11 13,15 21,7" stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="16,7 21,7 21,12" stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (emoji === '💼') {
    // Pie chart slices
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M22 12A10 10 0 0 0 12 2v10z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (emoji === '🏦') {
    // Bank / wallet
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x={2} y={7} width={20} height={14} rx={2} stroke={T.purple} strokeWidth={1.8} />
        <Path d="M16 11a2 2 0 0 1 0 4" stroke={T.purple} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M6 3l6-1 6 1" stroke={T.purple} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  return <Text style={{ fontSize: 16 }}>{emoji}</Text>;
}

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();

  const [summary, setSummary] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSummary().then(setSummary).catch(() => setError('Unable to load portfolio'));
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
        <Text style={s.title}>INVEX</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.hero}>
        <Text style={s.heroLbl}>TOTAL</Text>
        <Text style={s.heroVal}>{summary ? formatValue(summary.total_portfolio_value) : '...'}</Text>
        <Text style={s.heroGain}>{summary ? `▲ ${summary.total_pnl_pct?.toFixed(2) ?? '0.00'}% overall` : '▲ ...'}</Text>
      </View>

      {/* Equity curve */}
      <View style={s.chartBox}>
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
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, pointerEvents: 'none', boxShadow: 'inset 5px 5px 14px rgba(143,163,188,0.6), inset -7px -7px 16px rgba(255,255,255,1)' } as any} />
      </View>

      {error && <Text style={{ color: T.red, fontSize: 11, textAlign: 'center', marginHorizontal: 16, marginTop: 4, fontFamily: 'Syne_400Regular' }}>{error}</Text>}

      <SectionLabel label="BREAKDOWN" style={{ marginTop: 16 }} />
      {[
        { emoji: '📈', name: 'Equity Portfolio', sub: `${holdings.length > 0 ? holdings.length : '—'} stocks`, val: summary ? formatValue(summary.total_portfolio_value) : '...' },
        { emoji: '💼', name: 'Mutual Funds', sub: '—', val: '₹0' },
        { emoji: '🏦', name: 'Cash / Bank', sub: 'Manual entry', val: '—' },
      ].map((a) => (
        <NeuCard key={a.name} style={s.assetCard} borderRadius={20} padding={0}>
          <View style={s.assetRow}>
            <View style={s.assetLeft}>
              <View style={s.assetIcon}><AssetIcon emoji={a.emoji} /></View>
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
        {holdings.length === 0 ? (
          <View style={s.holdingRow}>
            <Text style={[s.holdingTicker, { color: T.textS }]}>No holdings data</Text>
          </View>
        ) : (
          [...holdings]
            .sort((a, b) => (b.current_value || 0) - (a.current_value || 0))
            .slice(0, 5)
            .map((h, i) => (
              <React.Fragment key={h.symbol}>
                {i > 0 && <View style={s.rowDiv} />}
                <View style={s.holdingRow}>
                  <Text style={s.holdingTicker}>{h.symbol}</Text>
                  <Text style={s.holdingVal}>{formatValue(h.current_value)}</Text>
                  <Text style={[s.holdingPct, { color: (h.pnl_pct || 0) >= 0 ? T.green : T.red }]}>
                    {(h.pnl_pct || 0) >= 0 ? '+' : ''}{(h.pnl_pct || 0).toFixed(1)}%
                  </Text>
                </View>
              </React.Fragment>
            ))
        )}
      </NeuCard>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 32, fontWeight: '700', color: T.textH, letterSpacing: -1 },
  heroGain: { fontSize: 13, color: T.green, fontWeight: '600', marginTop: 4, fontFamily: 'Syne_700Bold' },
  chartBox: {
    marginHorizontal: 16, borderRadius: 20, overflow: 'hidden',
    height: 90, padding: 8, paddingHorizontal: 12, paddingBottom: 4,
    backgroundColor: '#D8E2EE',
    borderTopWidth: 1, borderLeftWidth: 1,
    borderTopColor: 'rgba(143,163,188,0.5)', borderLeftColor: 'rgba(143,163,188,0.5)',
    borderBottomWidth: 0, borderRightWidth: 0,
  },
  assetCard: { marginHorizontal: 16, marginBottom: 14 },
  assetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 16 },
  assetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assetIcon: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E8EEF6',
    shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3,
    boxShadow: '3px 3px 6px rgba(163,177,198,0.6), -2px -2px 5px rgba(255,255,255,0.92)',
  },
  assetName: { fontSize: 13, fontWeight: '600', color: T.textH, fontFamily: 'Syne_700Bold' },
  assetSub: { fontSize: 10, color: T.textM, marginTop: 2, fontFamily: 'JetBrainsMono_400Regular' },
  assetVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 14, fontWeight: '600', color: T.textH },
  holdingsCard: { marginHorizontal: 16, marginBottom: 10 },
  rowDiv: { height: 1, backgroundColor: 'rgba(163,177,198,0.25)', marginHorizontal: 0 },
  holdingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 10 },
  holdingTicker: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13, fontWeight: '600', color: T.textH, flex: 1 },
  holdingVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, color: T.textB, marginRight: 16 },
  holdingPct: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, fontWeight: '600', color: T.green, width: 60, textAlign: 'right' },
});
