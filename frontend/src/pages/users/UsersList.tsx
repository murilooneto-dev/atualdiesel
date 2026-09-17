import { useState } from 'react'
import { ActionIcon, Badge, Button, Group, Paper } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { PageHeader } from '../../components/PageHeader'
import { DataTable } from '../../components/DataTable'
import { usersService } from '../../services/users'
import type { Profile } from '../../types'
import { UserForm, type UserFormValues } from './UserForm'

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  GERENTE: 'Gerente/Recepção',
  MECANICO: 'Mecânico',
}

export function UsersList() {
  const [formOpened, setFormOpened] = useState(false)
  const [editing, setEditing] = useState<Profile | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => usersService.list() })

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      notifications.show({ message: 'Usuário cadastrado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setFormOpened(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Omit<UserFormValues, 'email' | 'senha'> }) =>
      usersService.update(id, values),
    onSuccess: () => {
      notifications.show({ message: 'Usuário atualizado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setFormOpened(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      notifications.show({ message: 'Usuário removido.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleSubmit = (values: UserFormValues) => {
    if (editing) {
      const { email: _email, senha: _senha, ...rest } = values
      updateMutation.mutate({ id: editing.id, values: rest })
    } else {
      const { email: _email, ...rest } = values
      createMutation.mutate(rest)
    }
  }

  return (
    <>
      <PageHeader
        title="Usuários"
        action={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditing(null)
              setFormOpened(true)
            }}
          >
            Novo usuário
          </Button>
        }
      />
      <Paper withBorder p="md">
        <DataTable
          data={data}
          loading={isLoading}
          columns={[
            { header: 'Nome', render: (row) => row.nome },
            { header: 'Email', render: (row) => row.email },
            { header: 'Papel', render: (row) => roleLabels[row.papel] },
            { header: 'Status', render: (row) => <Badge color={row.ativo ? 'green' : 'gray'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge> },
            {
              header: 'Ações',
              render: (row: Profile) => (
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
          ]}
        />
      </Paper>
      <UserForm
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  )
}
