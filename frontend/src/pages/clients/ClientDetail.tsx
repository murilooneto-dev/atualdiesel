import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { clientsService } from '../../services/clients'
import { DataTable } from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import type { ServiceOrder, Vehicle } from '../../types'
import { PageHeader } from '../../components/PageHeader'

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: client } = useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.get(id!),
    enabled: !!id,
  })

  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['clients', id, 'vehicles'],
    queryFn: () => clientsService.vehicles(id!),
    enabled: !!id,
  })

  const { data: serviceOrders, isLoading: loadingOs } = useQuery({
    queryKey: ['clients', id, 'service-orders'],
    queryFn: () => clientsService.serviceOrders(id!),
    enabled: !!id,
  })

  if (!client) return null

  return (
    <Stack gap="lg">
      <PageHeader title={client.nome} />
      <Paper withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <div>
            <Text size="xs" c="dimmed">
              Tipo
            </Text>
            <Text>{client.tipoPessoa === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              CPF/CNPJ
            </Text>
            <Text>{client.cpfCnpj ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Telefone
            </Text>
            <Text>{client.telefone ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Email
            </Text>
            <Text>{client.email ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Endereço
            </Text>
            <Text>
              {[client.rua, client.numero, client.bairro, client.cidade, client.uf].filter(Boolean).join(', ') ||
                '-'}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Status
            </Text>
            <Badge color={client.ativo ? 'green' : 'gray'}>{client.ativo ? 'Ativo' : 'Inativo'}</Badge>
          </div>
        </SimpleGrid>
      </Paper>

      <div>
        <Title order={4} mb="sm">
          Veículos
        </Title>
        <Paper withBorder p="md">
          <DataTable
            data={vehicles}
            loading={loadingVehicles}
            columns={[
              { header: 'Placa', render: (row: Vehicle) => row.placa },
              { header: 'Marca/Modelo', render: (row: Vehicle) => `${row.marca} ${row.modelo}` },
              { header: 'Ano', render: (row: Vehicle) => row.ano ?? '-' },
            ]}
          />
        </Paper>
      </div>

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
              {
                header: 'Valor total',
                render: (row: ServiceOrder) =>
                  row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
              },
            ]}
          />
        </Paper>
      </div>
    </Stack>
  )
}
