import { Tabs } from '@mantine/core'
import { PageHeader } from '../../components/PageHeader'
import { UsersList } from '../users/UsersList'
import { ActivityLog } from './ActivityLog'

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Configurações" />
      <Tabs defaultValue="usuarios">
        <Tabs.List mb="md">
          <Tabs.Tab value="usuarios">Usuários</Tabs.Tab>
          <Tabs.Tab value="log">Log de atividades</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="usuarios">
          <UsersList />
        </Tabs.Panel>
        <Tabs.Panel value="log">
          <ActivityLog />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
