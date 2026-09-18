import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Collapse, Group, Paper, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronRight } from '@tabler/icons-react'
import { DataTable } from './DataTable'
import { serviceOrdersService } from '../services/serviceOrders'
import type { DashboardBucket } from '../utils/statusOs'
import type { ServiceOrder } from '../types'

export function StatusBucketList({ buckets }: { buckets: DashboardBucket[] }) {
  const max = Math.max(1, ...buckets.map((bucket) => bucket.quantidade))
  return (
    <Stack gap={8}>
      {buckets.map((bucket) => (
        <StatusBucketRow key={bucket.key} bucket={bucket} max={max} />
      ))}
    </Stack>
  )
}

function StatusBucketRow({ bucket, max, nested }: { bucket: DashboardBucket; max: number; nested?: boolean }) {
  const [opened, { toggle }] = useDisclosure(false)
  const navigate = useNavigate()
  const isLeaf = !!bucket.statuses

  const { data, isLoading } = useQuery({
    queryKey: ['service-orders', 'by-status', bucket.statuses],
    queryFn: () => serviceOrdersService.list({ status: bucket.statuses!.join(',') }),
    enabled: isLeaf && opened,
  })

  const childMax = bucket.children ? Math.max(1, ...bucket.children.map((child) => child.quantidade)) : 1

  return (
    <Box>
      <Paper
        withBorder
        bg={nested ? 'white' : 'gray.0'}
        radius="md"
        px="sm"
        py={8}
        onClick={toggle}
        style={{ cursor: 'pointer' }}
      >
        <Group gap={10} wrap="nowrap">
          <IconChevronRight
            size={14}
            style={{
              flexShrink: 0,
              color: 'var(--mantine-color-dimmed)',
              transform: opened ? 'rotate(90deg)' : 'none',
              transition: 'transform 150ms ease',
            }}
          />
          <Box
            w={9}
            h={9}
            style={{ borderRadius: '50%', background: `var(--mantine-color-${bucket.color}-6)`, flexShrink: 0 }}
          />
          <Text size="sm" w={150} style={{ flexShrink: 0 }}>
            {bucket.label}
          </Text>
          <Box style={{ flex: 1, height: 8, background: 'var(--mantine-color-gray-2)', borderRadius: 999 }}>
            <Box
              style={{
                height: '100%',
                width: `${(bucket.quantidade / max) * 100}%`,
                background: `var(--mantine-color-${bucket.color}-6)`,
                borderRadius: 999,
                transition: 'width 200ms ease',
              }}
            />
          </Box>
          <Text size="sm" fw={700} w={26} ta="right" style={{ flexShrink: 0 }}>
            {bucket.quantidade}
          </Text>
        </Group>
      </Paper>

      <Collapse in={opened}>
        <Box pl="lg" pt={8} pb={4}>
          {isLeaf ? (
            <DataTable<ServiceOrder>
              data={data}
              loading={isLoading}
              onRowClick={(row) => navigate(`/ordens-servico/${row.id}`)}
              emptyMessage="Nenhuma OS nesse status."
              columns={[
                { header: 'OS', render: (row) => `#${row.numeroOs}` },
                { header: 'Cliente', render: (row) => row.client?.nome ?? '-' },
                { header: 'Veículo', render: (row) => row.vehicle?.placa ?? '-' },
                {
                  header: 'Data abertura',
                  render: (row) => new Date(row.dataAbertura).toLocaleDateString('pt-BR'),
                },
                {
                  header: 'Valor total',
                  render: (row) => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                },
              ]}
            />
          ) : (
            <Stack gap={8}>
              {bucket.children!.map((child) => (
                <StatusBucketRow key={child.key} bucket={child} max={childMax} nested />
              ))}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
