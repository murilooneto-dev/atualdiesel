import type { Vehicle } from '../types'
import { createCrudService } from './crud'
import { api } from './api'

export const vehiclesService = {
  ...createCrudService<Vehicle>('vehicles'),
  serviceOrders: async (id: string) => {
    const { data } = await api.get(`/vehicles/${id}/service-orders`)
    return data
  },
  checklists: async (id: string) => {
    const { data } = await api.get(`/vehicles/${id}/checklists`)
    return data
  },
}
