import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Center, Loader } from '@mantine/core'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (roles && profile && !roles.includes(profile.papel)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
