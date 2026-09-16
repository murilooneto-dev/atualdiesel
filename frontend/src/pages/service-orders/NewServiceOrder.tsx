import { useMemo, useState } from 'react'
import { Button, Group, Paper, Select, Stack, Textarea } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { clientsService } from '../../services/clients'
import { serviceOrdersService } from '../../services/serviceOrders'
import type { Vehicle } from '../../types'

export function NewServiceOrder() {
  const navigate = useNavigate()
  const [clientId, setClientId] = useState<string | null>(null)
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [observacoes, setObservacoes] = useState('')

  const { data: clients } = useQuery({ queryKey: ['clients', 'all'], queryFn: () => clientsService.list() })
  const { data: vehicles } = useQuery({
    queryKey: ['clients', clientId, 'vehicles'],
    queryFn: () => clientsService.vehicles(clientId!),
    enabled: !!clientId,
  })

  const vehicleOptions = useMemo(
    () => (vehicles as Vehicle[] | undefined)?.map((v) => ({ value: v.id, label: `${v.placa} — ${v.marca} ${v.modelo}` })) ?? [],
    [vehicles],
  )

  const createMutation = useMutation({
    mutationFn: () => serviceOrdersService.create({ clientId, vehicleId, observacoes } as never),
    onSuccess: (os) => {
      notifications.show({ message: 'OS criada com sucesso.', color: 'green' })
      navigate(`/ordens-servico/${os.id}`)
    },
  })

  return (
    <>
      <PageHeader title="Nova Ordem de Serviço" />
      <Paper withBorder p="md" maw={560}>
        <Stack gap="sm">
          <Select
            label="Cliente"
            required
            searchable
            data={clients?.map((c) => ({ value: c.id, label: c.nome })) ?? []}
            value={clientId}
            onChange={(value) => {
              setClientId(value)
              setVehicleId(null)
            }}
          />
          <Select
            label="Veículo"
            required
            searchable
            disabled={!clientId}
            data={vehicleOptions}
            value={vehicleId}
            onChange={setVehicleId}
          />
          <Textarea label="Observações" value={observacoes} onChange={(e) => setObservacoes(e.currentTarget.value)} />
          <Group justify="flex-end" mt="md">
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!clientId || !vehicleId}
            >
              Criar OS
            </Button>
          </Group>
        </Stack>
      </Paper>
    </>
  )
}
