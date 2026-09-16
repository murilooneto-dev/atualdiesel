import type { Profile } from '../types'
import { createCrudService } from './crud'

export const usersService = createCrudService<Profile>('users')
