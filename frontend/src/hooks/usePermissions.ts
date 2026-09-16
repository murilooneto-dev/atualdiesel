import { useAuth } from './useAuth'
import type { Role } from '../types'

export function usePermissions() {
  const { profile } = useAuth()

  const hasRole = (...roles: Role[]) => {
    if (!profile) return false
    return roles.includes(profile.papel)
  }

  return {
    role: profile?.papel,
    isAdmin: profile?.papel === 'ADMIN',
    isGerente: profile?.papel === 'GERENTE',
    isMecanico: profile?.papel === 'MECANICO',
    hasRole,
  }
}
