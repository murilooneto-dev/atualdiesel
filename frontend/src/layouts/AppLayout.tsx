import { AppShell, Burger, Group, NavLink, Text, Button } from '@mantine/core'
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

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure()
  const { profile, signOut } = useAuth()
  const { hasRole } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700}>Atual Diesel — Gestão</Text>
          </Group>
          <Group>
            <Text size="sm" c="dimmed">
              {profile?.nome ?? '...'} ({profile?.papel ?? ''})
            </Text>
            <Button variant="subtle" size="xs" leftSection={<IconLogout size={14} />} onClick={() => void signOut()}>
              Sair
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems
          .filter((item) => hasRole(...(item.roles as unknown as Array<'ADMIN' | 'GERENTE' | 'MECANICO'>)))
          .map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={<item.icon size={18} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
