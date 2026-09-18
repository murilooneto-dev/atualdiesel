import { AppShell, Avatar, Burger, Group, Image, NavLink, Text, Button, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  IconDashboard,
  IconUsers,
  IconCar,
  IconTools,
  IconClipboardCheck,
  IconFileInvoice,
  IconUserCog,
  IconLogout,
} from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'

const navItems = [
  { label: 'Dashboard', path: '/', icon: IconDashboard, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Clientes', path: '/clientes', icon: IconUsers, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Veículos', path: '/veiculos', icon: IconCar, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Serviços', path: '/servicos', icon: IconTools, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Checklist', path: '/checklist', icon: IconClipboardCheck, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Ordens de Serviço', path: '/ordens-servico', icon: IconFileInvoice, roles: ['ADMIN', 'GERENTE', 'MECANICO'] },
  { label: 'Usuários', path: '/usuarios', icon: IconUserCog, roles: ['ADMIN'] },
] as const

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  GERENTE: 'Gerente/Recepção',
  MECANICO: 'Mecânico',
}

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure()
  const { profile, signOut } = useAuth()
  const { hasRole } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()

  const initials = (profile?.nome ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header bg="graphite.8" style={{ borderBottom: '1px solid var(--mantine-color-graphite-6)' }}>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
            <Image src="/logo-mark.png" alt="" h={36} w={36} fit="contain" />
            <Image src="/logo-wordmark.png" alt="Atual Diesel" h={26} w="auto" fit="contain" visibleFrom="xs" />
          </Group>
          <Group gap="sm" wrap="nowrap">
            <Avatar color="amber" radius="xl" size={32}>
              {initials}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Text size="sm" c="white" fw={500} lh={1.1} truncate>
                {profile?.nome ?? '...'}
              </Text>
              <Text size="xs" c="dimmed" lh={1.1}>
                {profile ? roleLabels[profile.papel] ?? profile.papel : ''}
              </Text>
            </div>
            <Button
              variant="subtle"
              color="gray.4"
              size="xs"
              leftSection={<IconLogout size={14} />}
              onClick={() => void signOut()}
            >
              Sair
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar bg="graphite.8" style={{ border: 'none' }}>
        <Stack p="md" gap={4} h="100%">
          {navItems
            .filter((item) => hasRole(...(item.roles as unknown as Array<'ADMIN' | 'GERENTE' | 'MECANICO'>)))
            .map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                variant="filled"
                color="amber"
                styles={{
                  root: { borderRadius: 'var(--mantine-radius-md)', color: 'var(--mantine-color-gray-3)' },
                  label: { fontWeight: 500 },
                }}
              />
            ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
