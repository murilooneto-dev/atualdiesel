import { useQuery } from '@tanstack/react-query'
import { Paper, SimpleGrid, Text, Title } from '@mantine/core'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../../components/PageHeader'
import { dashboardService } from '../../services/dashboard'

const statusLabels: Record<string, string> = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  AGUARDANDO_APROVACAO: 'Aguardando aprovação',
  AGUARDANDO_PECA: 'Aguardando peça',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Paper withBorder p="md">
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="xl" fw={700}>
        {value}
      </Text>
    </Paper>
  )
}

export function Dashboard() {
  const { data: summary } = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: dashboardService.summary })
  const { data: byStatus } = useQuery({
    queryKey: ['dashboard', 'by-status'],
    queryFn: dashboardService.serviceOrdersByStatus,
  })

  return (
    <>
      <PageHeader title="Dashboard" />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} mb="lg">
        <StatCard label="Clientes" value={summary?.totalClientes ?? '-'} />
        <StatCard label="Veículos" value={summary?.totalVeiculos ?? '-'} />
        <StatCard label="OS abertas" value={summary?.osAbertas ?? '-'} />
        <StatCard label="OS finalizadas (mês)" value={summary?.osFinalizadasMes ?? '-'} />
        <StatCard
          label="Faturamento (mês)"
          value={
            summary
              ? summary.faturamentoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : '-'
          }
        />
      </SimpleGrid>

      <Paper withBorder p="md">
        <Title order={4} mb="md">
          Ordens de serviço por status
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={
              Array.isArray(byStatus)
                ? byStatus.map((item) => ({ ...item, status: statusLabels[item.status] ?? item.status }))
                : []
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#fcc400" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </>
  )
}
