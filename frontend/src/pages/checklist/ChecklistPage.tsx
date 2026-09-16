import { Tabs } from '@mantine/core'
import { PageHeader } from '../../components/PageHeader'
import { NewChecklist } from './NewChecklist'
import { ChecklistItemTypesConfig } from './ChecklistItemTypesConfig'
import { usePermissions } from '../../hooks/usePermissions'

export function ChecklistPage() {
  const { hasRole } = usePermissions()
  const canConfigure = hasRole('ADMIN')

  return (
    <>
      <PageHeader title="Checklist de Entrada" />
      <Tabs defaultValue="novo">
        <Tabs.List mb="md">
          <Tabs.Tab value="novo">Novo checklist</Tabs.Tab>
          {canConfigure && <Tabs.Tab value="config">Configuração de itens</Tabs.Tab>}
        </Tabs.List>
        <Tabs.Panel value="novo">
          <NewChecklist />
        </Tabs.Panel>
        {canConfigure && (
          <Tabs.Panel value="config">
            <ChecklistItemTypesConfig />
          </Tabs.Panel>
        )}
      </Tabs>
    </>
  )
}
