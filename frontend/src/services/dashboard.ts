import type { DashboardSummary } from '../types'
import { api } from './api'

export const dashboardService = {
  summary: async () => {
    const { data } = await api.get<DashboardSummary>('/dashboard/summary')
    return data
  },
  serviceOrdersByStatus: async () => {
    const { data } = await api.get('/dashboard/service-orders-by-status')
    return data
  },
  revenueByPeriod: async () => {
    const { data } = await api.get('/dashboard/revenue-by-period')
    return data
  },
}
