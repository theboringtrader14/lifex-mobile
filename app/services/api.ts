import axios from 'axios'

const STAAX = axios.create({ baseURL: 'http://localhost:8000', timeout: 5000 })
const INVEX  = axios.create({ baseURL: 'http://localhost:8001', timeout: 5000 })
const BUDGEX = axios.create({ baseURL: 'http://localhost:8002', timeout: 5000 })

export const api = {
  dashboard:  () => STAAX.get('/api/v1/mobile/dashboard'),
  stats:      () => STAAX.get('/api/v1/system/stats'),
  portfolio:  () => INVEX.get('/api/v1/portfolio/summary'),
  expenses:   () => BUDGEX.get('/api/v1/expenses/summary'),
}
