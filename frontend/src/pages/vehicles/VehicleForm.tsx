import { Button, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clientsService } from '../../services/clients'
import type { Combustivel, Vehicle } from '../../types'

export interface VehicleFormValues {
  clientId: string
  placa: string
  marca: string
  modelo: string
  ano: number | ''
  cor: string
  quilometragemAtual: number | ''
  combustivel: Combustivel
  chassi: string
  observacoes: string
}

const emptyValues: VehicleFormValues = {
  clientId: '',
  placa: '',
  marca: '',
  modelo: '',
  ano: '',
  cor: '',
  quilometragemAtual: '',
  combustivel: 'FLEX',
  chassi: '',
  observacoes: '',
}

const combustivelOptions: { value: Combustivel; label: string }[] = [
  { value: 'GASOLINA', label: 'Gasolina' },
  { value: 'ETANOL', label: 'Etanol' },
  { value: 'FLEX', label: 'Flex' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'GNV', label: 'GNV' },
  { value: 'ELETRICO', label: 'Elétrico' },
  { value: 'HIBRIDO', label: 'Híbrido' },
]

export function VehicleForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  submitting,
  fixedClientId,
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (values: VehicleFormValues) => void
  initialValues?: Vehicle | null
  submitting?: boolean
  fixedClientId?: string
}) {
  const { data: clients } = useQuery({
    queryKey: ['clients', 'all'],
    queryFn: () => clientsService.list(),
    enabled: opened && !fixedClientId,
  })

  const form = useForm<VehicleFormValues>({ initialValues: emptyValues })

  useEffect(() => {
    if (opened) {
      form.setValues(
        initialValues
          ? {
              clientId: initialValues.clientId,
              placa: initialValues.placa,
              marca: initialValues.marca,
              modelo: initialValues.modelo,
              ano: initialValues.ano ?? '',
              cor: initialValues.cor ?? '',
              quilometragemAtual: initialValues.quilometragemAtual ?? '',
              combustivel: initialValues.combustivel,
              chassi: initialValues.chassi ?? '',
              observacoes: initialValues.observacoes ?? '',
            }
          : { ...emptyValues, clientId: fixedClientId ?? '' },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues, fixedClientId])

  return (
    <Modal opened={opened} onClose={onClose} title={initialValues ? 'Editar veículo' : 'Novo veículo'} size="lg">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          {!fixedClientId && (
            <Select
              label="Cliente"
              required
              data={clients?.map((c) => ({ value: c.id, label: c.nome })) ?? []}
              searchable
              {...form.getInputProps('clientId')}
            />
          )}
          <Group grow>
            <TextInput label="Placa" required {...form.getInputProps('placa')} />
            <Select label="Combustível" data={combustivelOptions} {...form.getInputProps('combustivel')} />
          </Group>
          <Group grow>
            <TextInput label="Marca" required {...form.getInputProps('marca')} />
            <TextInput label="Modelo" required {...form.getInputProps('modelo')} />
          </Group>
          <Group grow>
            <NumberInput label="Ano" {...form.getInputProps('ano')} />
            <TextInput label="Cor" {...form.getInputProps('cor')} />
            <NumberInput label="Km atual" {...form.getInputProps('quilometragemAtual')} />
          </Group>
          <TextInput label="Chassi" {...form.getInputProps('chassi')} />
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
