import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { NeuInset } from '../../components/ui/NeuInset';
import { NEU_RAISED_SM } from '../../constants/Shadows';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { analyzeAI } from '../../src/services/api';

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! Ask me anything about your trading performance, algos, or budget.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await analyzeAI(msg);
      const reply = res?.response ?? res?.message ?? res?.answer ?? 'No response received.';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Unable to reach AI. Check your connection.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.base }}>
      {/* Header */}
      <View style={[s.hdr, { paddingTop: insets.top + 20 }]}>
        <Text style={s.title}>LIFEX AI</Text>
        
      </View>

      {/* Chat area */}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>

        {messages.length <= 1 && (
          <View style={{ gap: 8, marginBottom: 10 }}>
            {[
              'Which algo performed best this week?',
              'Compare my strategies',
              "What's my win rate on Tuesdays?",
              'Should I trade tomorrow?',
            ].map(q => (
              <TouchableOpacity key={q} onPress={() => handleSend(q)} style={s.userBubbleOuter}>
                <View style={s.userBubbleInner}>
                  <Text style={s.userTxt}>{q}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <View key={i} style={s.userBubbleOuter}>
              <View style={s.userBubbleInner}>
                <Text style={s.userTxt}>{m.text}</Text>
              </View>
            </View>
          ) : (
            <View key={i} style={s.aiBubbleWrap}>
              <NeuInset style={s.aiBubble}>
                <Text style={s.aiTag}>LIFEX AI</Text>
                <Text style={s.aiTxt}>{m.text}</Text>
              </NeuInset>
            </View>
          )
        )}
        {loading && (
          <View style={s.aiBubbleWrap}>
            <NeuInset style={s.aiBubble}>
              <Text style={s.aiTag}>LIFEX AI</Text>
              <Text style={s.aiTxt}>Thinking…</Text>
            </NeuInset>
          </View>
        )}
      </ScrollView>

      {/* Input row */}
      <View style={[s.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
        <NeuInset style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Type or tap mic to ask..."
            placeholderTextColor={T.textS}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity activeOpacity={0.85} onPress={() => handleSend()}>
            <View style={s.micBtnOuter}>
              <View style={s.micBtnInner}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Rect x={9} y={1} width={6} height={11} rx={3} stroke={T.orange} strokeWidth={1.8} />
                  <Path d="M5 11a7 7 0 0014 0" stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
                  <Line x1={12} y1={18} x2={12} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
                  <Line x1={9} y1={21} x2={15} y2={21} stroke={T.orange} strokeWidth={1.8} strokeLinecap="round" />
                </Svg>
              </View>
            </View>
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
    shadowColor: '#A3B1C6', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3,
  },
  aiAvatarTxt: { fontSize: 12, fontWeight: '700', color: '#FFF', fontFamily: 'Syne_700Bold' },
  userBubbleOuter: {
    borderRadius: 18, borderBottomRightRadius: 4,
    backgroundColor: '#E8EEF6',
    alignSelf: 'flex-end', maxWidth: '80%',
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },
  userBubbleInner: {
    borderRadius: 18, borderBottomRightRadius: 4,
    borderTopWidth: 0, borderLeftWidth: 0,
    borderBottomWidth: 0, borderRightWidth: 0,
    backgroundColor: '#E8EEF6', padding: 12,
  },
  userTxt: { fontSize: 12, fontWeight: '500', color: T.textH, lineHeight: 19, fontFamily: 'Syne_400Regular' },
  aiBubbleWrap: { alignSelf: 'flex-start', maxWidth: '80%' },
  aiBubble: { borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, paddingHorizontal: 14, backgroundColor: '#E8EEF6', boxShadow: 'inset 5px 5px 14px rgba(143,163,188,0.6), inset -7px -7px 16px rgba(255,255,255,1)' },
  aiTag: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.orange, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  aiTxt: { fontSize: 12, lineHeight: 19, color: T.textB, fontFamily: 'Syne_400Regular' },
  hlTeal: { color: T.teal, fontWeight: '700', fontFamily: 'JetBrainsMono_600SemiBold' },
  hlTealMono: { color: T.teal, fontWeight: '700', fontFamily: 'JetBrainsMono_600SemiBold' },
  hlPurple: { color: T.purple, fontWeight: '700', fontFamily: 'Syne_700Bold' },
  inputWrap: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: T.base },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, paddingLeft: 16, borderRadius: 20, backgroundColor: '#E8EEF6' },
  input: { flex: 1, fontSize: 12, color: T.textS, fontStyle: 'italic' },
  micBtnOuter: {
    shadowColor: '#8FA3BC', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 5,
    borderRadius: 20, backgroundColor: '#E8EEF6',
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },
  micBtnInner: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EEF6',
    alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderRightWidth: 0,
  },
});
