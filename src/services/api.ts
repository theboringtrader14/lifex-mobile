import axios from 'axios';
import { Platform } from 'react-native';
import { STAAX_URL, INVEX_URL, BUDGEX_URL, BUDGEX_API_KEY } from '../config';

const STAAX = axios.create({ baseURL: STAAX_URL, timeout: 10000 });
const INVEX = axios.create({ baseURL: INVEX_URL, timeout: 10000 });
const BUDGEX = axios.create({ baseURL: BUDGEX_URL, timeout: 10000, headers: { 'x-api-key': BUDGEX_API_KEY } });

export const getHomeDashboard = () =>
  STAAX.get('/api/v1/mobile/dashboard').then(r => r.data);

export const getSystemStats = () =>
  STAAX.get('/api/v1/system/stats').then(r => r.data);

export const getSystemHealth = () =>
  STAAX.get('/api/v1/system/health').then(r => r.data);

export const getOrders = (date?: string) =>
  STAAX.get('/api/v1/orders/', { params: { trading_date: date, limit: 10 } }).then(r => r.data);

export const getAlgos = () =>
  STAAX.get('/api/v1/algos/', { params: { limit: 50 } }).then(r => r.data);

export const getPortfolio = () =>
  INVEX.get('/api/v1/portfolio/holdings').then(r => r.data);

export const getPortfolioSummary = () =>
  INVEX.get('/api/v1/portfolio/summary').then(r => r.data);

export const getBudgetSummary = () =>
  BUDGEX.get('/api/v1/expenses/summary').then(r => r.data);

export const analyzeAI = (message: string) =>
  STAAX.post('/api/v1/ai/analyze', { message, context: {} }).then(r => r.data);

export const getRecentExpenses = (limit = 5) =>
  BUDGEX.get('/api/v1/expenses', { params: { limit } }).then(r => r.data);

export const createExpense = (data: {
  amount: number
  category: string
  description: string
  date: string
}) => BUDGEX.post('/api/v1/expenses/', data).then(r => r.data);

export const parseExpense = (text: string) =>
  BUDGEX.post('/api/v1/parse', { text }).then((r) => r.data);

export const startSession = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await STAAX.post('/api/v1/accounts/angelone/mom/auto-login');
    await STAAX.post('/api/v1/system/start-market-feed');
    return { success: true, message: 'Session started' };
  } catch (e: any) {
    const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to start session';
    return { success: false, message: msg };
  }
};

export const registerPushToken = (token: string) =>
  STAAX.post('/api/v1/mobile/register-push', { token, platform: Platform.OS }).then(r => r.data);

export const getNotifications = () =>
  STAAX.get('/api/v1/mobile/notifications').then(r => r.data);

export async function checkSessionStatus(): Promise<{ smartstream: boolean; token_valid: boolean } | null> {
  try {
    const res = await fetch(`${API_BASE}/session/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
