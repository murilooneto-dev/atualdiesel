import { api } from './api'

export function createCrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>>(resource: string) {
  return {
    list: async (params?: Record<string, string | number | undefined>) => {
      const { data } = await api.get<T[]>(`/${resource}`, { params })
      return data
    },
    get: async (id: string) => {
      const { data } = await api.get<T>(`/${resource}/${id}`)
      return data
    },
    create: async (payload: TCreate) => {
      const { data } = await api.post<T>(`/${resource}`, payload)
      return data
    },
    update: async (id: string, payload: TUpdate) => {
      const { data } = await api.patch<T>(`/${resource}/${id}`, payload)
      return data
    },
    remove: async (id: string) => {
      await api.delete(`/${resource}/${id}`)
    },
  }
}
