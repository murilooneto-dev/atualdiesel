import { Button, Modal, Tabs } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { PageHeader } from '../../components/PageHeader'
import { NewChecklist } from './NewChecklist'
import { ChecklistsList } from './ChecklistsList'
import { ChecklistItemTypesConfig } from './ChecklistItemTypesConfig'
import { usePermissions } from '../../hooks/usePermissions'

export function ChecklistPage() {
  const { hasRole } = usePermissions()
  const canConfigure = hasRole('ADMIN')
  const [modalOpened, { open, close }] = useDisclosure(false)

  return (
    <>
      <PageHeader
        title="Checklist de Entrada"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            Novo checklist
          </Button>
        }
      />

      <Modal opened={modalOpened} onClose={close} title="Novo checklist" size="xl">
        <NewChecklist onSuccess={close} />
      </Modal>

      <Tabs defaultValue="realizados">
        <Tabs.List mb="md">
          <Tabs.Tab value="realizados">Checklists realizados</Tabs.Tab>
          {canConfigure && <Tabs.Tab value="config">Configuração de itens</Tabs.Tab>}
        </Tabs.List>
        <Tabs.Panel value="realizados">
          <ChecklistsList />
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
