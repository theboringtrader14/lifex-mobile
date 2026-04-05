import { create } from 'zustand'
import { api } from '../services/api'

interface AppState {
  netWorth:   number
  tradingPnl: number
  expenses:   number
  loading:    boolean
  error:      string | null
  fetch:      () => Promise<void>
}

export const useStore = create<AppState>((set) => ({
  netWorth:   0,
  tradingPnl: 0,
  expenses:   0,
  loading:    false,
  error:      null,
  fetch: async () => {
    set({ loading: true, error: null })
    try {
      const [dash, stats] = await Promise.allSettled([
        api.dashboard(),
        api.stats(),
      ])
      const d = dash.status === 'fulfilled' ? dash.value.data : {}
      const s = stats.status === 'fulfilled' ? stats.value.data : {}
      set({
        netWorth:   d.net_worth   ?? 0,
        tradingPnl: d.net_pnl     ?? s.today_pnl ?? 0,
        expenses:   d.expenses    ?? 0,
        loading: false,
      })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
}))
