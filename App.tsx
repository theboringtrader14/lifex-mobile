import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, View } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'
import TradingScreen from './src/screens/TradingScreen'
import NetWorthScreen from './src/screens/NetWorthScreen'
import BudgetScreen from './src/screens/BudgetScreen'
import { theme } from './src/theme'

const Tab = createBottomTabNavigator()

const icon = (name: string, focused: boolean) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>
    {name === 'Home' ? '⌂' : name === 'Trading' ? '📈' : name === 'NetWorth' ? '💎' : '💰'}
  </Text>
)

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => icon(route.name, focused),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 9, color: focused ? theme.orange : theme.textMuted, letterSpacing: 1, marginBottom: 4 }}>
              {route.name.toUpperCase()}
            </Text>
          ),
          tabBarStyle: {
            backgroundColor: '#16162A',
            borderTopColor: 'rgba(255,255,255,0.06)',
            borderTopWidth: 0.5,
            height: 80,
            paddingTop: 8,
          },
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: '#16162A' }} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Trading" component={TradingScreen} />
        <Tab.Screen name="NetWorth" component={NetWorthScreen} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
