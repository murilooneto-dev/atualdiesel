import { useQuery } from '@tanstack/react-query'
import { Paper, SimpleGrid, Text, Title } from '@mantine/core'
import { PageHeader } from '../../components/PageHeader'
import { StatusBarList } from '../../components/StatusBarList'
import { dashboardService } from '../../services/dashboard'
import { getDashboardGroups } from '../../utils/statusOs'

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

  const dashboardGroups = getDashboardGroups(Array.isArray(byStatus) ? byStatus : [])

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
        <StatusBarList items={dashboardGroups} />
      </Paper>
    </>
  )
}
