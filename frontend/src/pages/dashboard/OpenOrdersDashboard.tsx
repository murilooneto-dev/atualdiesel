import { useQuery } from '@tanstack/react-query'
import { Paper, Title } from '@mantine/core'
import { PageHeader } from '../../components/PageHeader'
import { StatusBarList } from '../../components/StatusBarList'
import { dashboardService } from '../../services/dashboard'
import { getOpenOrdersItems } from '../../utils/statusOs'

export function OpenOrdersDashboard() {
  const { data: byStatus } = useQuery({
    queryKey: ['dashboard', 'by-status'],
    queryFn: dashboardService.serviceOrdersByStatus,
  })

  const items = getOpenOrdersItems(Array.isArray(byStatus) ? byStatus : [])

  return (
    <>
      <PageHeader title="OS em aberto" />
      <Paper withBorder p="md">
        <Title order={4} mb="md">
          Situação das ordens de serviço em aberto
        </Title>
        <StatusBarList items={items} />
      </Paper>
    </>
  )
}
