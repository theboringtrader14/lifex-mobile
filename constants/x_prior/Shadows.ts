import { Platform, StyleSheet } from 'react-native';

// Dark shadow — bottom-right (iOS native)
export const NEU_RAISED = Platform.select({
  ios: {
    shadowColor: '#8FA3BC',
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.85,
    shadowRadius: 16,
  },
  android: {
    elevation: 10,
    shadowColor: '#8FA3BC',
  },
  default: {
    // Web: CSS box-shadow via style — applied in NeuCard directly
  },
}) as object;

export const NEU_RAISED_SM = Platform.select({
  ios: {
    shadowColor: '#8FA3BC',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.75,
    shadowRadius: 10,
  },
  android: {
    elevation: 6,
    shadowColor: '#8FA3BC',
  },
  default: {},
}) as object;

// Inset — pressed-in feel
export const NEU_INSET = {
  backgroundColor: '#D1DCE8',
  borderTopWidth: 2,
  borderLeftWidth: 2,
  borderTopColor: 'rgba(143,163,188,0.9)',
  borderLeftColor: 'rgba(143,163,188,0.9)',
  borderBottomWidth: 2,
  borderRightWidth: 2,
  borderBottomColor: 'rgba(255,255,255,1)',
  borderRightColor: 'rgba(255,255,255,1)',
};
