import { useState } from 'react'
import { ActionIcon, Button, Group, Modal, Paper, Stack, TextInput } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { DataTable } from '../../components/DataTable'
import { checklistItemTypesService } from '../../services/checklist'
import type { ChecklistItemType } from '../../types'

interface FormValues {
  nome: string
  categoria: string
}

export function ChecklistItemTypesConfig() {
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState<ChecklistItemType | null>(null)
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({ initialValues: { nome: '', categoria: '' } })

  const { data, isLoading } = useQuery({
    queryKey: ['checklist-item-types'],
    queryFn: () => checklistItemTypesService.list(),
  })

  const createMutation = useMutation({
    mutationFn: checklistItemTypesService.create,
    onSuccess: () => {
      notifications.show({ message: 'Item cadastrado.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['checklist-item-types'] })
      setOpened(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormValues }) => checklistItemTypesService.update(id, values),
    onSuccess: () => {
      notifications.show({ message: 'Item atualizado.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['checklist-item-types'] })
      setOpened(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: checklistItemTypesService.remove,
    onSuccess: () => {
      notifications.show({ message: 'Item removido.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['checklist-item-types'] })
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.setValues({ nome: '', categoria: '' })
    setOpened(true)
  }

  const openEdit = (item: ChecklistItemType) => {
    setEditing(item)
    form.setValues({ nome: item.nome, categoria: item.categoria ?? '' })
    setOpened(true)
  }

  const handleSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <>
      <Paper withBorder p="md">
        <Group justify="flex-end" mb="md">
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Novo item de checklist
          </Button>
        </Group>
        <DataTable
          data={data}
          loading={isLoading}
          columns={[
            { header: 'Nome', render: (row) => row.nome },
            { header: 'Categoria', render: (row) => row.categoria ?? '-' },
            {
              header: 'Ações',
              render: (row: ChecklistItemType) => (
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => openEdit(row)}>
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
      <Modal opened={opened} onClose={() => setOpened(false)} title={editing ? 'Editar item' : 'Novo item'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput label="Nome" required {...form.getInputProps('nome')} />
            <TextInput label="Categoria" {...form.getInputProps('categoria')} />
            <Group justify="flex-end" mt="md">
              <Button variant="default" type="button" onClick={() => setOpened(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                Salvar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
