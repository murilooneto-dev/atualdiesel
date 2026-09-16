import { useState } from 'react'
import { ActionIcon, Button, Group, Paper, TextInput } from '@mantine/core'
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { DataTable } from '../../components/DataTable'
import { vehiclesService } from '../../services/vehicles'
import type { Vehicle } from '../../types'
import { VehicleForm, type VehicleFormValues } from './VehicleForm'
import { usePermissions } from '../../hooks/usePermissions'

type VehiclePayload = Omit<VehicleFormValues, 'ano' | 'quilometragemAtual'> & {
  ano?: number
  quilometragemAtual?: number
}

export function VehiclesList() {
  const [search, setSearch] = useState('')
  const [formOpened, setFormOpened] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasRole } = usePermissions()
  const canEdit = hasRole('ADMIN', 'GERENTE')

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', search],
    queryFn: () => vehiclesService.list(search ? { search } : undefined),
  })

  const createMutation = useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: () => {
      notifications.show({ message: 'Veículo cadastrado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      setFormOpened(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: VehiclePayload }) => vehiclesService.update(id, values),
    onSuccess: () => {
      notifications.show({ message: 'Veículo atualizado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      setFormOpened(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: vehiclesService.remove,
    onSuccess: () => {
      notifications.show({ message: 'Veículo removido.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })

  const handleSubmit = (values: VehicleFormValues) => {
    const payload = {
      ...values,
      ano: values.ano === '' ? undefined : values.ano,
      quilometragemAtual: values.quilometragemAtual === '' ? undefined : values.quilometragemAtual,
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, values: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <>
      <PageHeader
        title="Veículos"
        action={
          canEdit && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setEditing(null)
                setFormOpened(true)
              }}
            >
              Novo veículo
            </Button>
          )
        }
      />
      <Paper withBorder p="md">
        <TextInput
          placeholder="Buscar por placa, marca, modelo..."
          leftSection={<IconSearch size={16} />}
          mb="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <DataTable
          data={data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/veiculos/${row.id}`)}
          columns={[
            { header: 'Placa', render: (row) => row.placa },
            { header: 'Marca/Modelo', render: (row) => `${row.marca} ${row.modelo}` },
            { header: 'Ano', render: (row) => row.ano ?? '-' },
            { header: 'Cliente', render: (row) => row.client?.nome ?? '-' },
            ...(canEdit
              ? [
                  {
                    header: 'Ações',
                    render: (row: Vehicle) => (
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
      <VehicleForm
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  )
}
