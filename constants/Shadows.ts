import { Platform } from 'react-native';

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
  default: {},
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

export const NEU_INSET = {
  backgroundColor: '#E8EEF6',
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderTopColor: 'rgba(143,163,188,0.4)',
  borderLeftColor: 'rgba(143,163,188,0.4)',
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.7)',
  borderRightColor: 'rgba(255,255,255,0.7)',
};
