import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { NeuCard } from '../../components/ui/NeuCard';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSystemStats, getOrders, getAlgos, getHomeDashboard, startSession, checkSessionStatus, registerPushToken } from '../../src/services/api';
import { getExpoPushToken } from '../../src/utils/pushNotifications';

export default function TradingScreen() {
  const insets = useSafeAreaInsets();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [algos, setAlgos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<'inactive'|'starting'|'active'>('inactive');
  const [mode, setMode] = useState<string>('PRACTIX');
  const pushRegistered = useRef(false);

  useEffect(() => {
    Promise.all([
      getSystemStats().then(setStats).catch(() => setError('Unable to load stats')),
      getOrders().then(d => setOrders(Array.isArray(d) ? d : d?.items ?? [])).catch(() => {}),
      getAlgos().then(d => setAlgos(Array.isArray(d) ? d : d?.items ?? [])).catch(() => {}),
      getHomeDashboard().then(d => setMode(d?.trading?.mode ?? 'PRACTIX')).catch(() => {}),
      (typeof checkSessionStatus === 'function' ? checkSessionStatus() : Promise.resolve(null)).then((s: any) => {
        if (s?.smartstream && s?.token_valid) setSessionStatus('active');
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sessionStatus === 'active' && !pushRegistered.current) {
      pushRegistered.current = true;
      getExpoPushToken().then(token => {
        if (token) registerPushToken(token).catch(() => {});
      }).catch(() => {});
    }
  }, [sessionStatus]);

  const formatPnl = (val: number | undefined) => {
    if (val === undefined || val === null) return '...';
    const sign = val >= 0 ? '+' : '';
    if (Math.abs(val) >= 100000) return `${sign}₹${(val / 100000).toFixed(1)}L`;
    if (Math.abs(val) >= 1000) return `${sign}₹${(val / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(val)}`;
  };
  const formatDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const activeCount = algos.filter(a => a.status === 'active').length;
  const waitingCount = algos.filter(a => a.status === 'waiting' || a.status === 'paused').length;
  const errorCount = algos.filter(a => a.status === 'error').length;

  const algoRows = [
    { dot: T.green, label: 'Active', count: algos.length > 0 ? String(activeCount) : (stats?.active_algos != null ? String(stats.active_algos) : '...'), countColor: T.green },
    { dot: T.textS, label: 'Waiting', count: algos.length > 0 ? String(waitingCount) : '...', countColor: T.textH },
    { dot: T.red, label: 'Error', count: algos.length > 0 ? String(errorCount) : '...', countColor: T.red },
  ];

  const tradeRows = orders.slice(0, 5).map(o => ({
    name: o.algo_name ?? o.algo_id ?? 'Unknown',
    type: `${o.symbol ?? 'NIFTY'} · ${o.order_type ?? 'Intraday'}`,
    pnl: formatPnl(o.pnl ?? o.realized_pnl),
    date: formatDate(o.fill_time ?? o.created_at ?? ''),
    pnlColor: (o.pnl ?? o.realized_pnl ?? 0) >= 0 ? T.green : T.red,
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.base, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={T.orange} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.base }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.hdr}>
        <Text style={s.title}>STAAX</Text>
        <TouchableOpacity
          disabled={sessionStatus !== 'inactive'}
          onPress={async () => {
            if (sessionStatus !== 'inactive') return;
            setSessionStatus('starting');
            const result = await startSession();
            if (result.success) {
              setSessionStatus('active');
            } else {
              setSessionStatus('inactive');
              Alert.alert('Session Failed', result.message);
            }
          }}
        >
          <View style={{ paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, backgroundColor: '#E8EEF6', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)' } as any}>
            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, color: sessionStatus === 'active' ? '#22DD88' : T.orange, fontFamily: 'Syne_700Bold' }}>
              {sessionStatus === 'starting' ? 'STARTING...' : sessionStatus === 'active' ? '✅ ACTIVE' : '⚡ START'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={{ backgroundColor: 'rgba(255,68,68,0.12)', borderRadius: 8, padding: 12, margin: 16, borderWidth: 1, borderColor: '#FF4444' }}>
          <Text style={{ color: '#FF4444', fontSize: 12, fontFamily: 'Inter' }}>{error}</Text>
        </View>
      )}

      {/* Hero P&L */}
      <View style={s.heroOuter}>
        <View style={s.heroInner}>
          <Text style={s.heroLbl}>FY P&L</Text>
          <Text style={s.heroVal}>{stats ? formatPnl(stats.fy_pnl) : '...'}</Text>
        </View>
      </View>

      {/* Mini cards */}
      <View style={s.twoCol}>
        {[{ lbl: 'TODAY', val: stats ? formatPnl(stats.today_pnl) : '...' }, { lbl: 'THIS WEEK', val: stats ? formatPnl(stats.week_pnl) : '...' }].map((c) => (
          <View key={c.lbl} style={s.miniCard}>
            <Text style={s.miniLbl}>{c.lbl}</Text>
            <Text style={s.miniVal}>{c.val}</Text>
          </View>
        ))}
      </View>

      <SectionLabel label="ALGO STATUS" style={{ marginTop: 14 }} />
      <NeuCard style={s.algoCard} borderRadius={20}>
        {algoRows.map((row, i) => (
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
      {(() => {
        const openPositions = orders.filter(o => o.status === 'open' || o.status === 'OPEN');
        if (openPositions.length === 0) {
          return <Text style={s.emptyText}>No open positions today</Text>;
        }
        return openPositions.map(o => (
          <NeuCard key={o.id} style={s.tradeCard} borderRadius={20} padding={0}>
            <View style={s.tradeRow}>
              <View>
                <Text style={s.tradeName}>{o.algo_name ?? o.algo_id ?? 'Unknown'}</Text>
                <Text style={s.tradeType}>{o.symbol ?? 'NIFTY'} · {o.order_type ?? 'Intraday'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.tradePnl, { color: (o.pnl ?? o.unrealized_pnl ?? 0) >= 0 ? T.green : T.red }]}>
                  {formatPnl(o.pnl ?? o.unrealized_pnl)}
                </Text>
              </View>
            </View>
          </NeuCard>
        ));
      })()}

      <SectionLabel label="RECENT TRADES" style={{ marginTop: 14 }} />
      {tradeRows.length > 0 ? tradeRows.map((t) => (
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
      )) : null}
      {tradeRows.length === 0 && <Text style={s.emptyText}>No trades yet</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  heroOuter: { marginHorizontal: 16 },
  heroInner: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 },
  heroLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold' },
  heroVal: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 36, fontWeight: '700', color: T.green, letterSpacing: -1 },
  twoCol: { flexDirection: 'row', gap: 18, paddingHorizontal: 16, marginTop: 6 },
  miniCard: {
    flex: 1, borderRadius: 20, backgroundColor: '#E8EEF6', padding: 14,
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },
  miniLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase', color: T.textS, marginBottom: 6, fontFamily: 'Syne_700Bold', paddingLeft: 2 },
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
