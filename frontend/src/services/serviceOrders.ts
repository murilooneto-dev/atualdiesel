import type { ServiceOrder, ServiceOrderItem, StatusOS } from '../types'
import { createCrudService } from './crud'
import { api } from './api'

export const serviceOrdersService = {
  ...createCrudService<ServiceOrder>('service-orders'),
  addItem: async (osId: string, payload: Partial<ServiceOrderItem>) => {
    const { data } = await api.post(`/service-orders/${osId}/items`, payload)
    return data
  },
  removeItem: async (osId: string, itemId: string) => {
    await api.delete(`/service-orders/${osId}/items/${itemId}`)
  },
  updateStatus: async (osId: string, status: StatusOS, observacao?: string) => {
    const { data } = await api.patch(`/service-orders/${osId}/status`, { status, observacao })
    return data
  },
  finalize: async (osId: string) => {
    const { data } = await api.post(`/service-orders/${osId}/finalize`)
    return data
  },
  openPdf: async (osId: string) => {
    const { data } = await api.get(`/service-orders/${osId}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(data)
    window.open(url, '_blank')
  },
}
