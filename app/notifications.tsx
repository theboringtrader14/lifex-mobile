import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';

// ── Notification types ──
type NotifType = 'tp_hit' | 'sl_hit' | 'algo_fired' | 'algo_error' | 'system_ready' | 'backend_down' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'tp_hit', title: 'Take Profit Hit', message: 'XAUUSD long position TP hit at $2,345.50. Profit: +$480', timestamp: '2 min ago', read: false },
  { id: '2', type: 'algo_fired', title: 'Algo Order Fired', message: 'NAS100 Channel Breakout — Buy order executed at 18,240', timestamp: '14 min ago', read: false },
  { id: '3', type: 'sl_hit', title: 'Stop Loss Hit', message: 'NAS100 long position SL hit at 18,180. Loss: -$120', timestamp: '1 hr ago', read: false },
  { id: '4', type: 'algo_error', title: 'Algo Error', message: 'XAUUSD DTR strategy: Failed to place order — Insufficient margin', timestamp: '2 hrs ago', read: true },
  { id: '5', type: 'system_ready', title: 'System Ready', message: 'All algo strategies are live and monitoring markets', timestamp: '6 hrs ago', read: true },
  { id: '6', type: 'tp_hit', title: 'Take Profit Hit', message: 'XAUUSD short position TP hit at $2,310.00. Profit: +$230', timestamp: 'Yesterday', read: true },
  { id: '7', type: 'backend_down', title: 'Backend Offline', message: 'LIFEX server unreachable. Retrying connection...', timestamp: 'Yesterday', read: true },
  { id: '8', type: 'error', title: 'API Error', message: 'Broker data feed interrupted. Last known price used.', timestamp: '2 days ago', read: true },
  { id: '9', type: 'system_ready', title: 'System Ready', message: 'Connection restored. All systems operational.', timestamp: '2 days ago', read: true },
];

const NOTIF_CONFIG: Record<NotifType, { color: string; bg: string }> = {
  tp_hit:       { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  algo_fired:   { color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
  sl_hit:       { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  algo_error:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  system_ready: { color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
  backend_down: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  error:        { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  info:         { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

function NotifIcon({ type, color }: { type: NotifType; color: string }) {
  const s = 16;
  if (type === 'tp_hit' || type === 'algo_fired' || type === 'system_ready') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (type === 'sl_hit') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
      <Line x1={12} y1={8} x2={12} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={12} y1={16} x2={12} y2={16} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: T.base }}>
      {/* Header */}
      <View style={[s.hdr, { paddingTop: insets.top + 12 }]}>
        <Text style={s.title}>NOTIFICATIONS</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={s.closeBtn}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke={T.textB} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 20, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((n) => {
          const cfg = NOTIF_CONFIG[n.type];
          return (
            <View key={n.id} style={[s.card, { marginBottom: 12 }] as any}>
              <View style={[s.iconBubble, { backgroundColor: cfg.bg }]}>
                <NotifIcon type={n.type} color={cfg.color} />
              </View>
              <View style={s.content}>
                <View style={s.titleRow}>
                  <Text style={[s.notifTitle, { color: cfg.color }]}>{n.title}</Text>
                  {!n.read && <View style={[s.unreadDot, { backgroundColor: cfg.color }]} />}
                </View>
                <Text style={s.msg}>{n.message}</Text>
                <Text style={s.time}>{n.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8EEF6',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },


  title: { fontSize: 15, fontWeight: '700', color: T.textH, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Syne_700Bold' },
  card: {
    borderRadius: 16, backgroundColor: '#E8EEF6', padding: 14,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    boxShadow: '4px 4px 10px rgba(163,177,198,0.6), -3px -3px 8px rgba(255,255,255,0.92)',
  },
  iconBubble: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  notifTitle: { fontSize: 12, fontWeight: '700', fontFamily: 'Syne_700Bold' },
  unreadDot: { width: 7, height: 7, borderRadius: 3.5 },
  msg: { fontSize: 11, color: T.textB, lineHeight: 16, fontFamily: 'Syne_400Regular', marginBottom: 4 },
  time: { fontSize: 10, color: T.textS, fontFamily: 'Syne_400Regular' },
});
