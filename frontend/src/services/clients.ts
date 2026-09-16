import type { Client } from '../types'
import { createCrudService } from './crud'
import { api } from './api'

export const clientsService = {
  ...createCrudService<Client>('clients'),
  vehicles: async (id: string) => {
    const { data } = await api.get(`/clients/${id}/vehicles`)
    return data
  },
  serviceOrders: async (id: string) => {
    const { data } = await api.get(`/clients/${id}/service-orders`)
    return data
  },
}
