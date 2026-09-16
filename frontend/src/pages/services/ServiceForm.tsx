import { Button, Group, Modal, NumberInput, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import type { Service } from '../../types'

export interface ServiceFormValues {
  nome: string
  descricao: string
  valorPadrao: number
}

const emptyValues: ServiceFormValues = { nome: '', descricao: '', valorPadrao: 0 }

export function ServiceForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  submitting,
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (values: ServiceFormValues) => void
  initialValues?: Service | null
  submitting?: boolean
}) {
  const form = useForm<ServiceFormValues>({
    initialValues: emptyValues,
    validate: {
      nome: (value) => (value.trim().length < 2 ? 'Informe o nome do serviço' : null),
    },
  })

  useEffect(() => {
    if (opened) {
      form.setValues(
        initialValues
          ? { nome: initialValues.nome, descricao: initialValues.descricao ?? '', valorPadrao: initialValues.valorPadrao }
          : emptyValues,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues])

  return (
    <Modal opened={opened} onClose={onClose} title={initialValues ? 'Editar serviço' : 'Novo serviço'}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput label="Nome" required {...form.getInputProps('nome')} />
          <Textarea label="Descrição" {...form.getInputProps('descricao')} />
          <NumberInput
            label="Valor padrão"
            required
            min={0}
            decimalScale={2}
            fixedDecimalScale
            prefix="R$ "
            {...form.getInputProps('valorPadrao')}
          />
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
