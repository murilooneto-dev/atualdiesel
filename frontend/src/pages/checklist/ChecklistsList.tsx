import { useState } from 'react'
import { Paper, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../components/DataTable'
import { checklistsService } from '../../services/checklist'
import type { EntryChecklist } from '../../types'

const nivelLabels: Record<string, string> = {
  RESERVA: 'Reserva',
  UM_QUARTO: '1/4',
  METADE: '1/2',
  TRES_QUARTOS: '3/4',
  CHEIO: 'Cheio',
}

export function ChecklistsList() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['checklists', search],
    queryFn: () => checklistsService.list(search ? { search } : undefined),
  })

  return (
    <Paper withBorder p="md">
      <TextInput
        placeholder="Buscar por placa..."
        leftSection={<IconSearch size={16} />}
        mb="md"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <DataTable
        data={data}
        loading={isLoading}
        onRowClick={(row) => navigate(`/checklist/${row.id}`)}
        columns={[
          { header: 'Nº', render: (row: EntryChecklist) => `#${row.numeroChecklist}` },
          {
            header: 'Data',
            render: (row: EntryChecklist) => new Date(row.criadoEm).toLocaleDateString('pt-BR'),
          },
          { header: 'Placa', render: (row: EntryChecklist) => row.vehicle?.placa ?? '-' },
          {
            header: 'Marca/Modelo',
            render: (row: EntryChecklist) => (row.vehicle ? `${row.vehicle.marca} ${row.vehicle.modelo}` : '-'),
          },
          { header: 'Km', render: (row: EntryChecklist) => row.quilometragem },
          {
            header: 'Combustível',
            render: (row: EntryChecklist) => nivelLabels[row.nivelCombustivel] ?? row.nivelCombustivel,
          },
        ]}
      />
    </Paper>
  )
}
