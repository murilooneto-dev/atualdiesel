import { useState } from 'react'
import { Button, Paper, Select } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { DataTable } from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import { serviceOrdersService } from '../../services/serviceOrders'
import type { ServiceOrder, StatusOS } from '../../types'

const statusOptions: { value: StatusOS; label: string }[] = [
  { value: 'ABERTA', label: 'Aberta' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'AGUARDANDO_APROVACAO', label: 'Aguardando aprovação' },
  { value: 'AGUARDANDO_PECA', label: 'Aguardando peça' },
  { value: 'CONCLUIDA', label: 'Concluída' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

export function ServiceOrdersList() {
  const [status, setStatus] = useState<string | null>(null)
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['service-orders', status],
    queryFn: () => serviceOrdersService.list(status ? { status } : undefined),
  })

  return (
    <>
      <PageHeader
        title="Ordens de Serviço"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/ordens-servico/nova')}>
            Nova OS
          </Button>
        }
      />
      <Paper withBorder p="md">
        <Select
          placeholder="Filtrar por status"
          data={statusOptions}
          clearable
          mb="md"
          w={280}
          value={status}
          onChange={setStatus}
        />
        <DataTable
          data={data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/ordens-servico/${row.id}`)}
          columns={[
            { header: 'OS', render: (row: ServiceOrder) => `#${row.numeroOs}` },
            { header: 'Cliente', render: (row: ServiceOrder) => row.client?.nome ?? '-' },
            { header: 'Veículo', render: (row: ServiceOrder) => row.vehicle?.placa ?? '-' },
            { header: 'Status', render: (row: ServiceOrder) => <StatusBadge status={row.status} /> },
            {
              header: 'Data abertura',
              render: (row: ServiceOrder) => new Date(row.dataAbertura).toLocaleDateString('pt-BR'),
            },
            {
              header: 'Valor total',
              render: (row: ServiceOrder) => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            },
          ]}
        />
      </Paper>
    </>
  )
}
