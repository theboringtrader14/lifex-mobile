import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Polyline, Circle, Rect, Line } from 'react-native-svg';
import { T } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// SVG icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const TradeIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="16 7 22 7 22 13" stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const PortfolioIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? T.orange : T.textS} strokeWidth={1.8} />
    <Path d="M12 7v5l3.5 2" stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);
const BudgetIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={5} width={20} height={14} rx={2} stroke={active ? T.orange : T.textS} strokeWidth={1.8} />
    <Line x1={2} y1={10} x2={22} y2={10} stroke={active ? T.orange : T.textS} strokeWidth={1.8} />
    <Line x1={7} y1={15} x2={9} y2={15} stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);
const AIIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.5 2 2 6 2 11c0 2.4 1 4.6 2.7 6.2L4 22l4.5-2C9.6 20.3 10.8 20.5 12 20.5c5.5 0 10-4 10-9S17.5 2 12 2z" stroke={active ? T.orange : T.textS} strokeWidth={1.8} strokeLinejoin="round" />
  </Svg>
);

const TABS = [
  { name: 'index', label: 'HOME', Icon: HomeIcon },
  { name: 'trading', label: 'TRADE', Icon: TradeIcon },
  { name: 'portfolio', label: 'PORTFOLIO', Icon: PortfolioIcon },
  { name: 'budget', label: 'BUDGET', Icon: BudgetIcon },
  { name: 'ai', label: 'AI', Icon: AIIcon },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.navWrap, { paddingBottom: insets.bottom > 0 ? insets.bottom - 8 : 8 }]}>
      <View style={styles.navCard}>
        {state.routes.map((route, idx) => {
          const active = state.index === idx;
          const tab = TABS[idx];
          const Icon = tab.Icon;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <View style={[styles.navIcon, active && styles.navIconActive]}>
                <Icon active={active} />
              </View>
              <Text style={[styles.navLbl, active && styles.navLblActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trading" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="budget" />
      <Tabs.Screen name="ai" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navWrap: {
    backgroundColor: T.base, paddingHorizontal: 16, paddingTop: 8,
  },
  navCard: {
    flexDirection: 'row', borderRadius: 22, backgroundColor: T.base,
    paddingVertical: 12, paddingHorizontal: 8,
    shadowColor: '#A3B1C6', shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75, shadowRadius: 14, elevation: 8,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 5 },
  navIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  navIconActive: {
    backgroundColor: '#D8E0ED',
    borderWidth: 1, borderTopColor: 'rgba(163,177,198,0.5)', borderLeftColor: 'rgba(163,177,198,0.5)',
    borderBottomColor: 'rgba(255,255,255,0.8)', borderRightColor: 'rgba(255,255,255,0.8)',
  },
  navLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6, color: T.textS, fontFamily: 'Syne_700Bold' },
  navLblActive: { color: T.orange },
});
