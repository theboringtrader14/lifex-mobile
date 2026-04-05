import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATS = [
  { name: 'Food', pct: 23, color: T.teal, amt: '₹4,200' },
  { name: 'Travel', pct: 17, color: T.orange, amt: '₹3,100' },
  { name: 'Bills', pct: 37, color: T.purple, amt: '₹6,800' },
  { name: 'Shopping', pct: 13, color: '#F59E0B', amt: '₹2,300' },
  { name: 'Others', pct: 11, color: T.textM, amt: '₹2,000' },
];

const EXPENSES = [
  { emoji: '🍔', name: 'Swiggy', sub: 'Food · Today', amt: '−₹350' },
  { emoji: '🚗', name: 'Uber', sub: 'Travel · Today', amt: '−₹220' },
  { emoji: '⚡', name: 'Electricity', sub: 'Bills · Apr 3', amt: '−₹1,200' },
];

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.base }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={T.textB} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>BUDGET</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.hero}>
        <Text style={s.heroLbl}>THIS MONTH</Text>
        <Text style={s.heroVal}>₹18,400</Text>
        <Text style={s.heroBudget}>of ₹30,000 budget</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressWrap}>
        <NeuInset style={s.progressTrack} borderRadius={8}>
          <View style={[s.progressFill, { width: '61.3%' }]} />
        </NeuInset>
      </View>

      <SectionLabel label="BY CATEGORY" style={{ marginTop: 16 }} />
      <NeuCard style={s.catCard} borderRadius={20} overflow="hidden" padding={0}>
        <View style={{ paddingVertical: 8 }}>
          {CATS.map((cat) => (
            <View key={cat.name} style={s.catRow}>
              <Text style={s.catName}>{cat.name}</Text>
              <View style={s.catBarWrap}>
                <NeuInset style={s.catTrack} borderRadius={6}>
                  <View style={[s.catFill, { width: `${cat.pct}%`, backgroundColor: cat.color }]} />
                </NeuInset>
              </View>
              <Text style={s.catPct}>{cat.pct}%</Text>
              <Text style={s.catAmt}>{cat.amt}</Text>
            </View>
          ))}
        </View>
      </NeuCard>

      <SectionLabel label="RECENT EXPENSES" style={{ marginTop: 16 }} />
      {EXPENSES.map((e) => (
        <NeuCard key={e.name} style={s.expCard} borderRadius={20} padding={0}>
          <View style={s.expRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={s.expIcon}><Text style={{ fontSize: 14 }}>{e.emoji}</Text></View>
              <View style={{ marginLeft: 10 }}>
                <Text style={s.expName}>{e.name}</Text>
                <Text style={s.expSub}>{e.sub}</Text>
              </View>
            </View>
            <Text style={s.expAmt}>{e.amt}</Text>
          </View>
        </NeuCard>
      ))}

      <TouchableOpacity activeOpacity={0.85}>
        <NeuCard style={s.addBtn} borderRadius={20} overflow="visible">
          <Text style={s.addBtnTxt}>⊕  Add Expense</Text>
        </NeuCard>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backTxt: { fontSize: 13, fontWeight: '600', color: T.textB, fontFamily: 'Syne_700Bold' },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 6 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 32, fontWeight: '700', color: T.textH, letterSpacing: -1 },
  heroBudget: { fontSize: 12, color: T.textM, marginTop: 4, fontFamily: 'Syne_400Regular' },
  progressWrap: { marginHorizontal: 16, marginTop: 10 },
  progressTrack: { height: 10, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8, backgroundColor: T.purple },
  catCard: { marginHorizontal: 16 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 8 },
  catName: { fontSize: 12, color: T.textB, fontWeight: '500', width: 56, fontFamily: 'Syne_400Regular' },
  catBarWrap: { flex: 1 },
  catTrack: { height: 8, borderRadius: 6, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 6 },
  catPct: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: T.textM, width: 28, textAlign: 'right' },
  catAmt: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 11, fontWeight: '600', color: T.textH, width: 44, textAlign: 'right' },
  expCard: { marginHorizontal: 16, marginBottom: 8 },
  expRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16 },
  expIcon: {
    width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.base, shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.75, shadowRadius: 6, elevation: 4,
  },
  expName: { fontSize: 13, fontWeight: '600', color: T.textH, fontFamily: 'Syne_700Bold' },
  expSub: { fontSize: 10, color: T.textM, marginTop: 1, fontFamily: 'Syne_400Regular' },
  expAmt: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 13, fontWeight: '600', color: T.red },
  addBtn: { marginHorizontal: 16, marginTop: 10, padding: 14, alignItems: 'center', justifyContent: 'center' },
  addBtnTxt: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, color: T.orange, fontFamily: 'Syne_700Bold' },
});
