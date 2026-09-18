import { useQuery } from '@tanstack/react-query'
import { Box, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
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

// Fixed order/hues so a status always keeps the same color regardless of which
// ones are present; validated colorblind-safe as this exact adjacent sequence.
const statusColors: Record<string, string> = {
  ABERTA: '#2a78d6',
  EM_ANDAMENTO: '#eb6834',
  AGUARDANDO_APROVACAO: '#1baf7a',
  AGUARDANDO_PECA: '#eda100',
  CONCLUIDA: '#e87ba4',
  CANCELADA: '#008300',
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

  const statusData = Array.isArray(byStatus)
    ? byStatus.map((item) => ({
        status: item.status,
        label: statusLabels[item.status] ?? item.status,
        color: statusColors[item.status] ?? '#898781',
        quantidade: item.quantidade,
      }))
    : []
  const totalOs = statusData.reduce((sum, item) => sum + item.quantidade, 0)

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
        <Group align="center" gap="xl" wrap="wrap">
          <Box style={{ position: 'relative', width: 220, height: 220, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="quantidade"
                  nameKey="label"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={statusData.length > 1 ? 2 : 0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, item) => [
                    `${value} (${totalOs ? Math.round((value / totalOs) * 100) : 0}%)`,
                    item.payload.label,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Text fw={800} size="28px" lh={1}>
                {totalOs}
              </Text>
              <Text size="xs" c="dimmed" tt="uppercase" mt={4}>
                OS total
              </Text>
            </Box>
          </Box>

          <Stack gap={8} style={{ flex: 1, minWidth: 200 }}>
            {statusData.map((item) => (
              <Group key={item.status} justify="space-between" wrap="nowrap" gap="xs">
                <Group gap={8} wrap="nowrap">
                  <Box w={9} h={9} style={{ borderRadius: 3, background: item.color, flexShrink: 0 }} />
                  <Text size="sm" c="dimmed">
                    {item.label}
                  </Text>
                </Group>
                <Group gap={8} wrap="nowrap">
                  <Text size="sm" fw={700}>
                    {item.quantidade}
                  </Text>
                  <Text size="xs" c="dimmed" w={34} ta="right">
                    {totalOs ? Math.round((item.quantidade / totalOs) * 100) : 0}%
                  </Text>
                </Group>
              </Group>
            ))}
            {statusData.length === 0 && (
              <Text size="sm" c="dimmed">
                Sem ordens de serviço registradas ainda.
              </Text>
            )}
          </Stack>
        </Group>
      </Paper>
    </>
  )
}
