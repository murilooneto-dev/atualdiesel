import { Button, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import type { Client } from '../../types'

export interface ClientFormValues {
  nome: string
  tipoPessoa: 'PF' | 'PJ'
  cpfCnpj: string
  telefone: string
  email: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  observacoes: string
}

const emptyValues: ClientFormValues = {
  nome: '',
  tipoPessoa: 'PF',
  cpfCnpj: '',
  telefone: '',
  email: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  observacoes: '',
}

export function ClientForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  submitting,
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (values: ClientFormValues) => void
  initialValues?: Client | null
  submitting?: boolean
}) {
  const form = useForm<ClientFormValues>({
    initialValues: emptyValues,
    validate: {
      nome: (value) => (value.trim().length < 2 ? 'Informe o nome do cliente' : null),
    },
  })

  useEffect(() => {
    if (opened) {
      form.setValues(
        initialValues
          ? {
              nome: initialValues.nome,
              tipoPessoa: initialValues.tipoPessoa,
              cpfCnpj: initialValues.cpfCnpj ?? '',
              telefone: initialValues.telefone ?? '',
              email: initialValues.email ?? '',
              rua: initialValues.rua ?? '',
              numero: initialValues.numero ?? '',
              bairro: initialValues.bairro ?? '',
              cidade: initialValues.cidade ?? '',
              uf: initialValues.uf ?? '',
              cep: initialValues.cep ?? '',
              observacoes: initialValues.observacoes ?? '',
            }
          : emptyValues,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues])

  return (
    <Modal opened={opened} onClose={onClose} title={initialValues ? 'Editar cliente' : 'Novo cliente'} size="lg">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <Group grow>
            <TextInput label="Nome / Razão social" required {...form.getInputProps('nome')} />
            <Select
              label="Tipo"
              data={[
                { value: 'PF', label: 'Pessoa física' },
                { value: 'PJ', label: 'Pessoa jurídica' },
              ]}
              {...form.getInputProps('tipoPessoa')}
            />
          </Group>
          <Group grow>
            <TextInput label="CPF/CNPJ" {...form.getInputProps('cpfCnpj')} />
            <TextInput label="Telefone" {...form.getInputProps('telefone')} />
          </Group>
          <TextInput label="Email" type="email" {...form.getInputProps('email')} />
          <Group grow>
            <TextInput label="Rua" {...form.getInputProps('rua')} />
            <TextInput label="Número" {...form.getInputProps('numero')} />
          </Group>
          <Group grow>
            <TextInput label="Bairro" {...form.getInputProps('bairro')} />
            <TextInput label="Cidade" {...form.getInputProps('cidade')} />
            <TextInput label="UF" maxLength={2} {...form.getInputProps('uf')} />
            <TextInput label="CEP" {...form.getInputProps('cep')} />
          </Group>
          <Textarea label="Observações" {...form.getInputProps('observacoes')} />
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
