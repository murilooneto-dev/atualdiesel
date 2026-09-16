import type { Service } from '../types'
import { createCrudService } from './crud'

export const servicesService = createCrudService<Service>('services')
