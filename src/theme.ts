export const theme = {
  // Base
  bg: '#1A1A2E',
  bgCard: '#1E1E35',
  bgDeep: '#16162A',

  // Accent
  orange: '#FF6B00',
  orangeMuted: 'rgba(255,107,0,0.15)',
  green: '#22DD88',
  red: '#FF4444',
  amber: '#FFB347',

  // Text
  textPrimary: 'rgba(232,232,248,0.95)',
  textMuted: 'rgba(232,232,248,0.45)',
  textAccent: '#FF6B00',

  // Neumorphic shadows (dark variant)
  shadowLight: {
    shadowColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  shadowDark: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },

  // Fonts
  fontDisplay: 'System',  // Will use system font, styled bold
  fontMono: 'Courier',

  // Border radius
  radiusCard: 20,
  radiusButton: 50,
}

export const neuCard = {
  backgroundColor: '#1E1E35',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 8, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 16,
  elevation: 10,
  borderWidth: 0.5,
  borderColor: 'rgba(255,255,255,0.06)',
}

export const neuButton = {
  backgroundColor: '#1E1E35',
  borderRadius: 50,
  shadowColor: '#000',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 0.6,
  shadowRadius: 12,
  elevation: 8,
}
