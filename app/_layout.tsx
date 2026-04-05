import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Syne_400Regular, Syne_700Bold, Syne_800ExtraBold,
} from '@expo-google-fonts/syne';
import {
  JetBrainsMono_400Regular, JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { View, ActivityIndicator } from 'react-native';
import { T } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    Syne_400Regular, Syne_700Bold, Syne_800ExtraBold,
    JetBrainsMono_400Regular, JetBrainsMono_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: T.base, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={T.orange} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={T.base} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: T.base } }} />
    </>
  );
}
