import React, { useEffect, useRef } from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native'

interface Props {
  listening: boolean
  onPress: () => void
}

export function MicButton({ listening, onPress }: Props) {
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (listening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.25, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
        ])
      ).start()
    } else {
      pulse.stopAnimation()
      Animated.timing(pulse, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    }
  }, [listening])

  return (
    <View style={styles.wrapper}>
      {/* Pulsing orange ring */}
      <Animated.View style={[
        styles.ring,
        { transform: [{ scale: pulse }], opacity: listening ? 0.5 : 0 }
      ]} />
      {/* Mic button */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.button, listening && styles.buttonActive]}
      >
        <Text style={styles.icon}>{listening ? '⏹' : '🎙'}</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>{listening ? 'Listening…' : 'Tap to speak'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#FF6B00',
    top: -10,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1E1E35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  buttonActive: {
    borderColor: 'rgba(255,107,0,0.4)',
    borderWidth: 2,
  },
  icon: { fontSize: 52 },
  hint: { marginTop: 16, fontSize: 12, color: 'rgba(232,232,248,0.4)', letterSpacing: 1.5 },
})
