import { Table, Text, Center, Loader } from '@mantine/core'
import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading,
  onRowClick,
  emptyMessage = 'Nenhum registro encontrado.',
}: {
  data: T[] | undefined
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
}) {
  if (loading) {
    return (
      <Center py="xl">
        <Loader size="sm" />
      </Center>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </Center>
    )
  }

  return (
    <Table striped highlightOnHover withTableBorder stickyHeader stickyHeaderOffset={60}>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={col.header}>{col.header}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row) => (
          <Table.Tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? 'pointer' : undefined }}
          >
            {columns.map((col) => (
              <Table.Td key={col.header}>{col.render(row)}</Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
