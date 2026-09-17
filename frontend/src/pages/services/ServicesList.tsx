import { useMemo, useState } from 'react'
import { ActionIcon, Button, Group, Paper, TextInput } from '@mantine/core'
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { PageHeader } from '../../components/PageHeader'
import { DataTable } from '../../components/DataTable'
import { servicesService } from '../../services/services'
import type { Service } from '../../types'
import { ServiceForm, type ServiceFormValues } from './ServiceForm'
import { usePermissions } from '../../hooks/usePermissions'

export function ServicesList() {
  const [formOpened, setFormOpened] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const { hasRole } = usePermissions()
  const canEdit = hasRole('ADMIN', 'GERENTE')

  const { data, isLoading } = useQuery({ queryKey: ['services'], queryFn: () => servicesService.list() })

  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const term = search.trim().toLowerCase()
    return data?.filter((s) => s.nome.toLowerCase().includes(term))
  }, [data, search])

  const createMutation = useMutation({
    mutationFn: servicesService.create,
    onSuccess: () => {
      notifications.show({ message: 'Serviço cadastrado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setFormOpened(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ServiceFormValues }) => servicesService.update(id, values),
    onSuccess: () => {
      notifications.show({ message: 'Serviço atualizado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setFormOpened(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: servicesService.remove,
    onSuccess: () => {
      notifications.show({ message: 'Serviço removido.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const handleSubmit = (values: ServiceFormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <>
      <PageHeader
        title="Serviços"
        action={
          canEdit && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setEditing(null)
                setFormOpened(true)
              }}
            >
              Novo serviço
            </Button>
          )
        }
      />
      <Paper withBorder p="md">
        <TextInput
          placeholder="Buscar por nome..."
          leftSection={<IconSearch size={16} />}
          mb="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <DataTable
          data={filteredData}
          loading={isLoading}
          columns={[
            { header: 'Nome', render: (row) => row.nome },
            { header: 'Descrição', render: (row) => row.descricao ?? '-' },
            {
              header: 'Valor padrão',
              render: (row) => row.valorPadrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            },
            ...(canEdit
              ? [
                  {
                    header: 'Ações',
                    render: (row: Service) => (
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setEditing(row)
                            setFormOpened(true)
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => removeMutation.mutate(row.id)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Paper>
      <ServiceForm
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  )
}
