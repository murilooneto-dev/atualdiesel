import { api } from './api'
import type { AuditLog } from '../types'

export const auditService = {
  list: async (params?: { entidade?: string; limit?: number }) => {
    const { data } = await api.get<AuditLog[]>('/audit-logs', { params })
    return data
  },
}
