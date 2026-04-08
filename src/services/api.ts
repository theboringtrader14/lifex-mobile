import axios from 'axios';
import { STAAX_URL, INVEX_URL, BUDGEX_URL } from '../config';

const STAAX = axios.create({ baseURL: STAAX_URL, timeout: 10000 });
const INVEX = axios.create({ baseURL: INVEX_URL, timeout: 10000 });
const BUDGEX = axios.create({ baseURL: BUDGEX_URL, timeout: 10000 });

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
