import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBudgetSummary, getRecentExpenses } from '../../src/services/api';

const CATS = [
  { name: 'Food', pct: 23, color: T.teal, amt: '₹4,200' },
  { name: 'Travel', pct: 17, color: T.orange, amt: '₹3,100' },
  { name: 'Bills', pct: 37, color: T.purple, amt: '₹6,800' },
  { name: 'Shopping', pct: 13, color: '#F59E0B', amt: '₹2,300' },
  { name: 'Others', pct: 11, color: T.textM, amt: '₹2,000' },
];

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();

  const [budgetData, setBudgetData] = useState<any>(null);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const CAT_EMOJI: Record<string, string> = {
    Food: '🍔', Travel: '🚗', Bills: '⚡', Shopping: '🛍️', Others: '💰',
  };

  useEffect(() => {
    getBudgetSummary().then(setBudgetData).catch(() => setError('Unable to load budget'));
    getRecentExpenses(5).then(data => setRecentExpenses(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const formatValue = (val: number | undefined) => {
    if (val === undefined || val === null) return '...';
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${Math.round(val)}`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.base }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <View style={s.hdr}>
        <Text style={s.title}>BUDGEX</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.hero}>
        <Text style={s.heroLbl}>THIS MONTH</Text>
        <Text style={s.heroVal}>{budgetData ? formatValue(budgetData.monthly) : '...'}</Text>
        <Text style={s.heroBudget}>of {budgetData ? formatValue(budgetData.monthly_budget ?? 30000) : '₹30,000'} budget</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressWrap}>
        <NeuInset style={s.progressTrack} borderRadius={8}>
          <View style={[s.progressFill, { width: `${budgetData ? Math.min(100, Math.round((budgetData.monthly / (budgetData.monthly_budget ?? 30000)) * 100)) : 61}%` }]} />
        </NeuInset>
      </View>

      {error && <Text style={{ color: T.red, fontSize: 11, textAlign: 'center', marginHorizontal: 16, marginTop: 4, fontFamily: 'Syne_400Regular' }}>{error}</Text>}

      <SectionLabel label="BY CATEGORY" style={{ marginTop: 16 }} />
      <NeuCard style={s.catCard} borderRadius={20} overflow="hidden" padding={0}>
        <View style={{ paddingVertical: 8 }}>
          {CATS.map((cat) => (
            <View key={cat.name} style={s.catRow}>
              <Text style={s.catName}>{cat.name}</Text>
              <View style={s.catBarWrap}>
                <NeuInset style={s.catTrack} borderRadius={6}>
                  <View style={[s.catFill, { width: `${cat.pct}%`, backgroundColor: cat.color, boxShadow: `0 0 10px 3px ${cat.color}99, 0 0 20px 6px ${cat.color}55` }]} />
                </NeuInset>
              </View>
              <Text style={s.catPct}>{cat.pct}%</Text>
              <Text style={s.catAmt}>{cat.amt}</Text>
            </View>
          ))}
        </View>
      </NeuCard>

      <SectionLabel label="RECENT EXPENSES" style={{ marginTop: 16 }} />
      {recentExpenses.length === 0 ? (
        <NeuCard style={s.expCard} borderRadius={20} padding={0}>
          <View style={s.expRow}>
            <Text style={{ color: T.textS, fontSize: 12, fontFamily: 'Syne_400Regular' }}>No expenses recorded yet</Text>
          </View>
        </NeuCard>
      ) : (
        recentExpenses.map((e) => (
          <NeuCard key={e.id} style={s.expCard} borderRadius={20} padding={0}>
            <View style={s.expRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={s.expIcon}><Text style={{ fontSize: 14 }}>{CAT_EMOJI[e.category] ?? '💰'}</Text></View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={s.expName}>{e.description || e.category}</Text>
                  <Text style={s.expSub}>{e.category} · {e.date}</Text>
                </View>
              </View>
              <Text style={s.expAmt}>−₹{e.amount}</Text>
            </View>
          </NeuCard>
        ))
      )}

      <TouchableOpacity activeOpacity={0.85}>
        
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 6 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 32, fontWeight: '700', color: T.textH, letterSpacing: -1 },
  heroBudget: { fontSize: 12, color: T.textM, marginTop: 4, fontFamily: 'JetBrainsMono_400Regular' },
  progressWrap: { marginHorizontal: 16, marginTop: 10 },
  progressTrack: {
    height: 10, borderRadius: 8, overflow: 'hidden',
    backgroundColor: '#E8EEF6',
    boxShadow: 'inset 3px 3px 6px rgba(143,163,188,0.5), inset -2px -2px 4px rgba(255,255,255,0.9)',
  },
  progressFill: { height: '100%', borderRadius: 8, backgroundColor: T.purple },
  catCard: { marginHorizontal: 16 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 8 },
  catName: { fontSize: 12, color: T.textB, fontWeight: '500', width: 56, fontFamily: 'Syne_400Regular' },
  catBarWrap: { flex: 1 },
  catTrack: {
    height: 10, borderRadius: 8, overflow: 'hidden',
    backgroundColor: '#D8E2EE',
    boxShadow: 'inset 3px 3px 6px rgba(143,163,188,0.5), inset -2px -2px 4px rgba(255,255,255,0.9)',
  },
  catFill: { height: '100%', borderRadius: 6, shadowColor: 'transparent' },
  catPct: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, color: T.textM, width: 28, textAlign: 'right' },
  catAmt: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, fontWeight: '600', color: T.textH, width: 48, textAlign: 'right' },
  expCard: { marginHorizontal: 16, marginBottom: 14 },
  expRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 },
  expIcon: {
    width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E8EEF6', marginRight: 10,
    shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3,
  },
  expName: { fontSize: 13, fontWeight: '600', color: T.textH, fontFamily: 'Syne_700Bold' },
  expSub: { fontSize: 10, color: T.textM, marginTop: 1, fontFamily: 'Syne_400Regular' },
  expAmt: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13, fontWeight: '600', color: T.red },
  addBtn: { marginHorizontal: 16, marginTop: 4 },
  addBtnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  addBtnTxt: { fontSize: 13, fontWeight: '700', color: T.orange, fontFamily: 'Syne_700Bold' },
});
