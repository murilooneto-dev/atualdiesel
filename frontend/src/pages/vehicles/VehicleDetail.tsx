import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { vehiclesService } from '../../services/vehicles'
import { DataTable } from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import type { EntryChecklist, ServiceOrder } from '../../types'
import { PageHeader } from '../../components/PageHeader'

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: vehicle } = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehiclesService.get(id!),
    enabled: !!id,
  })

  const { data: serviceOrders, isLoading: loadingOs } = useQuery({
    queryKey: ['vehicles', id, 'service-orders'],
    queryFn: () => vehiclesService.serviceOrders(id!),
    enabled: !!id,
  })

  const { data: checklists, isLoading: loadingChecklists } = useQuery({
    queryKey: ['vehicles', id, 'checklists'],
    queryFn: () => vehiclesService.checklists(id!),
    enabled: !!id,
  })

  if (!vehicle) return null

  return (
    <Stack gap="lg">
      <PageHeader title={`${vehicle.placa} — ${vehicle.marca} ${vehicle.modelo}`} />
      <Paper withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }}>
          <div>
            <Text size="xs" c="dimmed">
              Cliente
            </Text>
            <Text>{vehicle.client?.nome ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Ano
            </Text>
            <Text>{vehicle.ano ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Cor
            </Text>
            <Text>{vehicle.cor ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Km atual
            </Text>
            <Text>{vehicle.quilometragemAtual ?? '-'}</Text>
          </div>
        </SimpleGrid>
      </Paper>

      <div>
        <Title order={4} mb="sm">
          Histórico de Ordens de Serviço
        </Title>
        <Paper withBorder p="md">
          <DataTable
            data={serviceOrders}
            loading={loadingOs}
            columns={[
              { header: 'OS', render: (row: ServiceOrder) => `#${row.numeroOs}` },
              { header: 'Status', render: (row: ServiceOrder) => <StatusBadge status={row.status} /> },
              {
                header: 'Data abertura',
                render: (row: ServiceOrder) => new Date(row.dataAbertura).toLocaleDateString('pt-BR'),
              },
            ]}
          />
        </Paper>
      </div>

      <div>
        <Title order={4} mb="sm">
          Histórico de Checklists
        </Title>
        <Paper withBorder p="md">
          <DataTable
            data={checklists}
            loading={loadingChecklists}
            columns={[
              {
                header: 'Data',
                render: (row: EntryChecklist) => new Date(row.criadoEm).toLocaleDateString('pt-BR'),
              },
              { header: 'Km', render: (row: EntryChecklist) => row.quilometragem },
              { header: 'Combustível', render: (row: EntryChecklist) => row.nivelCombustivel },
            ]}
          />
        </Paper>
      </div>
    </Stack>
  )
}
