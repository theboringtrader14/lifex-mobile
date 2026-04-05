import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { StatBadge } from '../../components/ui/StatBadge';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TradingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.base }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={T.textB} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>TRADING</Text>
        <StatBadge label="PRACTIX" />
      </View>

      {/* Hero P&L */}
      <View style={s.hero}>
        <Text style={s.heroLbl}>FY P&L</Text>
        <Text style={s.heroVal}>+₹294.75</Text>
        <Text style={s.heroRoi}>▲ 0.02% ROI</Text>
      </View>

      {/* Mini cards */}
      <View style={s.twoCol}>
        {[{ lbl: 'TODAY', val: '+₹0' }, { lbl: 'THIS WEEK', val: '+₹0' }].map((c) => (
          <NeuCard key={c.lbl} style={{ flex: 1 }} borderRadius={20} padding={14}>
            <Text style={s.miniLbl}>{c.lbl}</Text>
            <Text style={s.miniVal}>{c.val}</Text>
          </NeuCard>
        ))}
      </View>

      <SectionLabel label="ALGO STATUS" style={{ marginTop: 14 }} />
      <NeuCard style={s.algoCard} borderRadius={20}>
        {[
          { dot: T.green, label: 'Active', count: '21', countColor: T.green },
          { dot: T.textS, label: 'Waiting', count: '3', countColor: T.textH },
          { dot: T.red, label: 'Error', count: '0', countColor: T.red },
        ].map((row, i) => (
          <React.Fragment key={row.label}>
            {i > 0 && <View style={s.rowDiv} />}
            <View style={s.algoRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[s.algoDot, { backgroundColor: row.dot }]} />
                <Text style={s.algoLbl}>{row.label}</Text>
              </View>
              <Text style={[s.algoCount, { color: row.countColor }]}>{row.count}</Text>
            </View>
          </React.Fragment>
        ))}
      </NeuCard>

      <SectionLabel label="OPEN POSITIONS" style={{ marginTop: 14 }} />
      <Text style={s.emptyText}>No open positions today</Text>

      <SectionLabel label="RECENT TRADES" style={{ marginTop: 14 }} />
      {[
        { name: 'Algo-2', type: 'NIFTY CE · Intraday', pnl: '+₹2,604', date: 'Mar 30', pnlColor: T.green },
        { name: 'Test New', type: 'NIFTY CE · Direct', pnl: '+₹24', date: 'Mar 30', pnlColor: T.green },
      ].map((t) => (
        <NeuCard key={t.name} style={s.tradeCard} borderRadius={20} padding={0}>
          <View style={s.tradeRow}>
            <View>
              <Text style={s.tradeName}>{t.name}</Text>
              <Text style={s.tradeType}>{t.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[s.tradePnl, { color: t.pnlColor }]}>{t.pnl}</Text>
              <Text style={s.tradeDate}>{t.date}</Text>
            </View>
          </View>
        </NeuCard>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backTxt: { fontSize: 13, fontWeight: '600', color: T.textB, fontFamily: 'Syne_700Bold' },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 12 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 36, fontWeight: '700', color: T.green, letterSpacing: -1 },
  heroRoi: { fontSize: 12, color: T.textM, marginTop: 4, fontFamily: 'Syne_400Regular' },
  twoCol: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  miniLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  miniVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 20, fontWeight: '600', color: T.textH },
  algoCard: { marginHorizontal: 16 },
  algoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  rowDiv: { height: 1, backgroundColor: 'rgba(163,177,198,0.25)', marginHorizontal: 16 },
  algoDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  algoLbl: { fontSize: 12, color: T.textB, fontWeight: '500', fontFamily: 'Syne_400Regular' },
  algoCount: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 14, fontWeight: '600' },
  emptyText: { paddingHorizontal: 24, paddingVertical: 10, fontSize: 12, color: T.textM, fontStyle: 'italic', fontFamily: 'Syne_400Regular' },
  tradeCard: { marginHorizontal: 16, marginBottom: 10 },
  tradeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 },
  tradeName: { fontSize: 13, fontWeight: '600', color: T.textH, fontFamily: 'Syne_700Bold' },
  tradeType: { fontSize: 10, color: T.textM, marginTop: 2, fontFamily: 'Syne_400Regular' },
  tradePnl: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13, fontWeight: '600' },
  tradeDate: { fontSize: 10, color: T.textM, marginTop: 2, fontFamily: 'Syne_400Regular' },
});
