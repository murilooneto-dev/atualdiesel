import { useState } from 'react'
import { ActionIcon, Button, Group, Paper, TextInput } from '@mantine/core'
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { DataTable } from '../../components/DataTable'
import { clientsService } from '../../services/clients'
import type { Client } from '../../types'
import { ClientForm, type ClientFormValues } from './ClientForm'
import { usePermissions } from '../../hooks/usePermissions'

export function ClientsList() {
  const [search, setSearch] = useState('')
  const [formOpened, setFormOpened] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasRole } = usePermissions()
  const canEdit = hasRole('ADMIN', 'GERENTE')

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search],
    queryFn: () => clientsService.list(search ? { search } : undefined),
  })

  const createMutation = useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => {
      notifications.show({ message: 'Cliente cadastrado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setFormOpened(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ClientFormValues }) => clientsService.update(id, values),
    onSuccess: () => {
      notifications.show({ message: 'Cliente atualizado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setFormOpened(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: clientsService.remove,
    onSuccess: () => {
      notifications.show({ message: 'Cliente removido.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  const handleSubmit = (values: ClientFormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        action={
          canEdit && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setEditing(null)
                setFormOpened(true)
              }}
            >
              Novo cliente
            </Button>
          )
        }
      />
      <Paper withBorder p="md">
        <TextInput
          placeholder="Buscar por nome, CPF/CNPJ..."
          leftSection={<IconSearch size={16} />}
          mb="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <DataTable
          data={data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/clientes/${row.id}`)}
          columns={[
            { header: 'Nome', render: (row) => row.nome },
            { header: 'Tipo', render: (row) => (row.tipoPessoa === 'PF' ? 'Pessoa física' : 'Pessoa jurídica') },
            { header: 'Telefone', render: (row) => row.telefone ?? '-' },
            { header: 'Email', render: (row) => row.email ?? '-' },
            ...(canEdit
              ? [
                  {
                    header: 'Ações',
                    render: (row: Client) => (
                      <Group gap="xs" onClick={(e) => e.stopPropagation()}>
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
      <ClientForm
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  )
}
