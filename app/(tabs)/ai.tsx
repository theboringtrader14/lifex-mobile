import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1, backgroundColor: T.base }}>
      {/* Header */}
      <View style={[s.hdr, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={T.textB} strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>LIFEX AI</Text>
        <View style={s.aiAvatar}><Text style={s.aiAvatarTxt}>AI</Text></View>
      </View>

      {/* Chat area */}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>

        {/* Exchange 1 */}
        <View style={s.userBubbleWrap}>
          <View style={s.userBubble}>
            <Text style={s.userTxt}>Which strategy works best on Tuesdays?</Text>
          </View>
        </View>
        <View style={s.aiBubbleWrap}>
          <NeuInset style={s.aiBubble}>
            <Text style={s.aiTag}>LIFEX AI</Text>
            <Text style={s.aiTxt}>
              Direct strategy outperforms W&T on Tuesdays with{' '}
              <Text style={s.hlTeal}>67%</Text> win rate vs{' '}
              <Text style={s.hlPurple}>45%</Text>. Avg P&L{' '}
              <Text style={s.hlTealMono}>₹2,340</Text> vs ₹890. NIFTY CE sells particularly strong.
            </Text>
          </NeuInset>
        </View>

        {/* Exchange 2 */}
        <View style={s.userBubbleWrap}>
          <View style={s.userBubble}>
            <Text style={s.userTxt}>What's my best algo?</Text>
          </View>
        </View>
        <View style={s.aiBubbleWrap}>
          <NeuInset style={s.aiBubble}>
            <Text style={s.aiTag}>LIFEX AI</Text>
            <Text style={s.aiTxt}>
              <Text style={s.hlTeal}>Algo-2</Text> leads — ₹2,604 total P&L,{' '}
              <Text style={s.hlTeal}>100% win rate</Text> (2W/0L). Direct/Intraday on NIFTY. Consider increasing lot size.
            </Text>
          </NeuInset>
        </View>

        {/* Exchange 3 */}
        <View style={s.userBubbleWrap}>
          <View style={s.userBubble}>
            <Text style={s.userTxt}>Show me this week's summary</Text>
          </View>
        </View>
        <View style={s.aiBubbleWrap}>
          <NeuInset style={s.aiBubble}>
            <Text style={s.aiTag}>LIFEX AI</Text>
            <Text style={s.aiTxt}>
              This week: <Text style={s.hlTeal}>0 trades</Text> executed. All 21 algos active, monitoring. Portfolio up{' '}
              <Text style={s.hlTeal}>+₹234</Text> from equity movement. Budget at 61% with 25 days remaining.
            </Text>
          </NeuInset>
        </View>
      </ScrollView>

      {/* Input row */}
      <View style={[s.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
        <NeuInset style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Type or tap mic to ask..."
            placeholderTextColor={T.textS}
          />
          <TouchableOpacity activeOpacity={0.85}>
            <NeuCard style={s.micBtn} borderRadius={20} overflow="hidden">
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={9} y={1} width={6} height={11} rx={3} stroke={T.orange} strokeWidth={1.8} />
                <Path d="M5 11a7 7 0 0014 0" stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={12} y1={18} x2={12} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
                <Line x1={9} y1={21} x2={15} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </NeuCard>
          </TouchableOpacity>
        </NeuInset>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backTxt: { fontSize: 13, fontWeight: '600', color: T.textB, fontFamily: 'Syne_700Bold' },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  aiAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: T.orange,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.75, shadowRadius: 8, elevation: 5,
  },
  aiAvatarTxt: { fontSize: 12, fontWeight: '700', color: '#FFF', fontFamily: 'Syne_700Bold' },
  userBubbleWrap: { alignSelf: 'flex-end', maxWidth: '80%' },
  userBubble: {
    backgroundColor: T.base,
    padding: 12, paddingHorizontal: 14,
    borderRadius: 18, borderBottomRightRadius: 4,
    shadowColor: '#A3B1C6', shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.75, shadowRadius: 10, elevation: 6,
  },
  userTxt: { fontSize: 12, fontWeight: '500', color: T.textH, lineHeight: 19, fontFamily: 'Syne_400Regular' },
  aiBubbleWrap: { alignSelf: 'flex-start', maxWidth: '80%' },
  aiBubble: { borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, paddingHorizontal: 14 },
  aiTag: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.orange, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  aiTxt: { fontSize: 12, lineHeight: 19, color: T.textB, fontFamily: 'Syne_400Regular' },
  hlTeal: { color: T.teal, fontWeight: '700', fontFamily: 'JetBrainsMono_600SemiBold' },
  hlTealMono: { color: T.teal, fontWeight: '700', fontFamily: 'JetBrainsMono_600SemiBold' },
  hlPurple: { color: T.purple, fontWeight: '700', fontFamily: 'Syne_700Bold' },
  inputWrap: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: T.base },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, paddingLeft: 16, borderRadius: 20 },
  input: { flex: 1, fontSize: 12, color: T.textS, fontStyle: 'italic' },
  micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
