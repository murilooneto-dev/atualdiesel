import { Button, Group, Modal, PasswordInput, Select, Stack, Switch, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import type { Profile, Role } from '../../types'

export interface UserFormValues {
  nome: string
  email: string
  papel: Role
  ativo: boolean
  senha?: string
}

const emptyValues: UserFormValues = { nome: '', email: '', papel: 'MECANICO', ativo: true, senha: '' }

const roleOptions: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GERENTE', label: 'Gerente/Recepção' },
  { value: 'MECANICO', label: 'Mecânico' },
]

export function UserForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  submitting,
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (values: UserFormValues) => void
  initialValues?: Profile | null
  submitting?: boolean
}) {
  const form = useForm<UserFormValues>({
    initialValues: emptyValues,
    validate: {
      nome: (value) => (value.trim().length < 2 ? 'Informe o nome' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'),
    },
  })

  useEffect(() => {
    if (opened) {
      form.setValues(
        initialValues
          ? { nome: initialValues.nome, email: initialValues.email, papel: initialValues.papel, ativo: initialValues.ativo, senha: '' }
          : emptyValues,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues])

  return (
    <Modal opened={opened} onClose={onClose} title={initialValues ? 'Editar usuário' : 'Novo usuário'}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput label="Nome" required {...form.getInputProps('nome')} />
          <TextInput label="Email" type="email" required disabled={!!initialValues} {...form.getInputProps('email')} />
          {!initialValues && (
            <PasswordInput label="Senha inicial" required minLength={6} {...form.getInputProps('senha')} />
          )}
          <Select label="Papel" data={roleOptions} {...form.getInputProps('papel')} />
          <Switch label="Ativo" checked={form.values.ativo} onChange={(e) => form.setFieldValue('ativo', e.currentTarget.checked)} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Salvar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
