import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions, Platform, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { NeuInset } from '../../components/ui/NeuInset';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { MicButton } from '../../components/ui/MicButton';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHomeDashboard, getPortfolioSummary, getBudgetSummary, analyzeAI, createExpense } from '../../src/services/api';
import { Audio } from 'expo-av';

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

function parseExpenseLocally(text: string): { amount: number; category: string; description: string; date: string } {
  const amountMatch = text.match(/\d+(\.\d+)?/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
  const cats: Record<string, string[]> = {
    Food: ['food', 'swiggy', 'zomato', 'restaurant', 'eat', 'lunch', 'dinner', 'breakfast', 'coffee', 'tea', 'chai', 'snack'],
    Travel: ['travel', 'uber', 'ola', 'auto', 'cab', 'bus', 'train', 'metro', 'petrol', 'fuel', 'taxi'],
    Bills: ['bill', 'electricity', 'water', 'gas', 'recharge', 'mobile', 'internet', 'wifi', 'subscription'],
    Shopping: ['shop', 'amazon', 'flipkart', 'clothes', 'shoes', 'buy', 'purchase', 'mall'],
  };
  const lower = text.toLowerCase();
  let category = 'Others';
  for (const [cat, keywords] of Object.entries(cats)) {
    if (keywords.some(k => lower.includes(k))) { category = cat; break; }
  }
  const description = text.replace(/\d+(\.\d+)?/, '').replace(/\s+/g, ' ').trim() || text;
  return { amount, category, description, date: new Date().toISOString().split('T')[0] };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [dashboard, setDashboard] = useState<any>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<any>(null);
  const [budgetSummary, setBudgetSummary] = useState<any>(null);

  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'confirming'>('idle');
  const [manualInput, setManualInput] = useState('');
  const [parsedExpense, setParsedExpense] = useState<{ amount: number; category: string; description: string; date: string } | null>(null);
  const recognitionRef = useRef<any>(null);

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

  const processTranscript = async (text: string) => {
    setVoiceState('processing');
    setManualInput('');
    let parsed = parseExpenseLocally(text);
    try {
      const res = await analyzeAI(
        `Parse this expense text and reply ONLY with a valid JSON object with keys: amount (number), category (one of: Food/Travel/Bills/Shopping/Others), description (string). Input: "${text}"`
      );
      const jsonMatch = (res?.response || '').match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const ai = JSON.parse(jsonMatch[0]);
        if (ai.amount) parsed = { ...parsed, ...ai };
      }
    } catch {}
    setParsedExpense(parsed);
    setVoiceState('confirming');
  };

  const handleMicPress = async () => {
    if (voiceState === 'confirming' || voiceState === 'processing') return;

    if (voiceState === 'idle') {
      if (Platform.OS === 'web') {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SR) {
          const rec = new SR();
          rec.lang = 'en-IN';
          rec.continuous = false;
          rec.interimResults = false;
          recognitionRef.current = rec;
          rec.onresult = (e: any) => {
            const text = e.results[0][0].transcript;
            processTranscript(text);
          };
          rec.onerror = () => setVoiceState('idle');
          rec.onend = () => {};
          rec.start();
          setVoiceState('listening');
          return;
        }
      }
      // Native or web fallback: request mic permission then show text input
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Microphone permission is required to record expenses.');
          return;
        }
      } catch {}
      setVoiceState('listening');
    } else if (voiceState === 'listening') {
      if (Platform.OS === 'web' && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (manualInput.trim()) {
        processTranscript(manualInput.trim());
      } else {
        setVoiceState('idle');
      }
    }
  };

  const handleConfirmExpense = async () => {
    if (!parsedExpense) return;
    try {
      await createExpense(parsedExpense);
      setVoiceState('idle');
      setParsedExpense(null);
      getBudgetSummary().then(setBudgetSummary).catch(() => {});
    } catch {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    }
  };

  const handleCancelExpense = () => {
    setVoiceState('idle');
    setParsedExpense(null);
    setManualInput('');
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
  };

  const widgets = [
    { color: T.teal, label: 'NET WORTH', value: formatValue(portfolioSummary?.total_portfolio_value), sub: '+0.5% today', subColor: T.teal, route: '/portfolio' },
    { color: T.orange, label: 'TRADING', value: formatPnl(dashboard?.trading?.today_pnl), sub: 'today P&L', subColor: T.textM, route: '/trading' },
    { color: T.purple, label: 'BUDGET', value: formatValue(budgetSummary?.monthly), sub: 'this month', subColor: T.textM, route: '/budget' },
  ];

  const renderVoiceContent = () => {
    if (voiceState === 'confirming' && parsedExpense) {
      return (
        <View>
          <Text style={[s.voiceHint, { marginBottom: 6 }]}>CONFIRM EXPENSE</Text>
          <Text style={[s.voiceText, { color: T.textH, fontWeight: '700', fontSize: 16 }]}>
            {parsedExpense.description}
          </Text>
          <Text style={[s.voiceText, { color: T.orange, marginTop: 4 }]}>
            ₹{parsedExpense.amount} · {parsedExpense.category}
          </Text>
          <Text style={[s.voiceText, { color: T.textS, fontSize: 11, marginTop: 2 }]}>
            {parsedExpense.date}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Pressable onPress={handleConfirmExpense} style={[s.confirmBtn, { backgroundColor: T.teal }]}>
              <Text style={s.confirmBtnTxt}>SAVE</Text>
            </Pressable>
            <Pressable onPress={handleCancelExpense} style={[s.confirmBtn, { backgroundColor: 'rgba(163,177,198,0.25)' }]}>
              <Text style={[s.confirmBtnTxt, { color: T.textM }]}>CANCEL</Text>
            </Pressable>
          </View>
        </View>
      );
    }
    if (voiceState === 'processing') {
      return (
        <>
          <Text style={s.voiceHint}>PARSING EXPENSE…</Text>
          <Text style={[s.voiceText, { color: T.orange }]}>AI is reading your expense…</Text>
        </>
      );
    }
    if (voiceState === 'listening') {
      const hasWebSpeech = Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      return (
        <>
          <Text style={s.voiceHint}>SAY YOUR EXPENSE…</Text>
          {hasWebSpeech ? (
            <Text style={[s.voiceText, { color: T.teal }]}>Listening… speak now</Text>
          ) : (
            <TextInput
              style={s.voiceInput}
              placeholder='e.g. "Swiggy 350 food"'
              placeholderTextColor={T.textS}
              value={manualInput}
              onChangeText={setManualInput}
              onSubmitEditing={() => manualInput.trim() && processTranscript(manualInput.trim())}
              autoFocus
            />
          )}
        </>
      );
    }
    return (
      <>
        <Text style={s.voiceHint}>SAY YOUR EXPENSE…</Text>
        <Text style={s.voiceText}>e.g. "Swiggy 350 food"</Text>
      </>
    );
  };

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
            <Text style={[s.statNum, { color: T.textH }]}>{dashboard?.trading?.active_algos ?? '...'}</Text>
            <Text style={s.statLbl}>ACTIVE ALGOS</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(163,177,198,0.45)', marginVertical: 14 }} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: dashboard?.networth?.change_pct != null && dashboard.networth.change_pct >= 0 ? T.teal : T.red }]}>
              {dashboard?.networth?.change_pct != null ? `${dashboard.networth.change_pct >= 0 ? '+' : ''}${dashboard.networth.change_pct}%` : '...'}
            </Text>
            <Text style={s.statLbl}>DAY CHG.</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(163,177,198,0.45)', marginVertical: 14 }} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: T.teal }]}>{dashboard ? formatPnl(dashboard.trading?.today_pnl) : '...'}</Text>
            <Text style={s.statLbl}>TODAY P&L</Text>
          </View>
        </View>
      </NeuCard>

      <SectionLabel label="LIFEX AI" style={{ marginTop: 14 }} />

      {/* Voice section */}
      <View style={s.voiceWrap}>
        <NeuInset style={s.voiceBox} borderRadius={24} overflow="visible">
          {renderVoiceContent()}
        </NeuInset>
        {/* Mic — half overlaps bottom of container */}
        <View style={s.micAnchor}>
          <MicButton onPress={handleMicPress} listening={voiceState === 'listening'} />
        </View>
        <Text style={s.tapHint}>
          {voiceState === 'idle' ? 'TAP MIC TO RECORD EXPENSE' :
           voiceState === 'listening' ? 'TAP MIC TO CONFIRM' :
           voiceState === 'processing' ? 'PARSING…' : 'CONFIRM OR CANCEL'}
        </Text>
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
  widgetRow: { flexDirection: 'row', gap: 18, paddingHorizontal: 16, marginTop: 6 },
  accent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginBottom: 8 },
  wLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: T.textS, marginBottom: 3, fontFamily: 'Syne_700Bold' },
  wVal: { fontSize: 15, fontWeight: '600', color: T.textH, letterSpacing: -0.5, fontFamily: 'JetBrainsMono_600SemiBold', marginBottom: 2 },
  wSub: { fontSize: 9, fontWeight: '500', fontFamily: 'Syne_400Regular' },
  arrowCircle: {
    position: 'absolute', bottom: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#E8EEF6', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#A3B1C6', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 3,
    boxShadow: '3px 3px 6px rgba(163,177,198,0.6), -2px -2px 5px rgba(255,255,255,0.92)',
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
  voiceInput: {
    fontSize: 14, color: T.textH, fontFamily: 'Syne_400Regular',
    borderBottomWidth: 1, borderBottomColor: T.orange,
    paddingVertical: 6, paddingHorizontal: 2,
    marginTop: 4,
  },
  tapHint: { marginTop: 18, fontSize: 10, color: T.textS, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '700', fontFamily: 'Syne_700Bold' },
  confirmBtn: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnTxt: {
    fontSize: 11, fontWeight: '700', color: '#FFF', letterSpacing: 0.8,
    textTransform: 'uppercase', fontFamily: 'Syne_700Bold',
  },
});
