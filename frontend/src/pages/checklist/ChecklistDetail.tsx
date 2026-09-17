import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, Group, Image, Paper, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import { checklistsService } from '../../services/checklist'
import { PageHeader } from '../../components/PageHeader'
import type { StatusChecklistItem } from '../../types'

const nivelLabels: Record<string, string> = {
  RESERVA: 'Reserva',
  UM_QUARTO: '1/4',
  METADE: '1/2',
  TRES_QUARTOS: '3/4',
  CHEIO: 'Cheio',
}

const statusConfig: Record<StatusChecklistItem, { label: string; color: string }> = {
  OK: { label: 'OK', color: 'green' },
  ATENCAO: { label: 'Atenção', color: 'yellow' },
  NAO_APLICAVEL: { label: 'Não aplicável', color: 'gray' },
}

export function ChecklistDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: checklist } = useQuery({
    queryKey: ['checklists', id],
    queryFn: () => checklistsService.get(id!),
    enabled: !!id,
  })

  if (!checklist) return null

  return (
    <Stack gap="lg">
      <PageHeader
        title={`Checklist #${checklist.numeroChecklist} — ${checklist.vehicle?.placa ?? ''}`}
        action={
          <Button
            variant="default"
            leftSection={<IconDownload size={16} />}
            onClick={() => checklistsService.openPdf(checklist.id)}
          >
            Gerar PDF
          </Button>
        }
      />

      <Paper withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }}>
          <div>
            <Text size="xs" c="dimmed">Veículo</Text>
            <Text>{checklist.vehicle?.placa ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Data</Text>
            <Text>{new Date(checklist.criadoEm).toLocaleDateString('pt-BR')}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Quilometragem</Text>
            <Text>{checklist.quilometragem} km</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Combustível</Text>
            <Text>{nivelLabels[checklist.nivelCombustivel] ?? checklist.nivelCombustivel}</Text>
          </div>
        </SimpleGrid>
      </Paper>

      <div>
        <Title order={4} mb="sm">Itens verificados</Title>
        <Paper withBorder p="md">
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Item</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Observação</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {checklist.itens.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.checklistItemType?.nome ?? '-'}</Table.Td>
                  <Table.Td>
                    <Badge color={statusConfig[item.status].color}>{statusConfig[item.status].label}</Badge>
                  </Table.Td>
                  <Table.Td>{item.observacao ?? '-'}</Table.Td>
                </Table.Tr>
              ))}
              {checklist.itens.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed" size="sm">Nenhum item registrado.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </div>

      {checklist.observacoesGerais && (
        <div>
          <Title order={4} mb="sm">Observações gerais</Title>
          <Paper withBorder p="md">
            <Text>{checklist.observacoesGerais}</Text>
          </Paper>
        </div>
      )}

      {checklist.fotos.length > 0 && (
        <div>
          <Title order={4} mb="sm">Fotos</Title>
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            {checklist.fotos.map((foto) => (
              <Image key={foto.id} src={foto.urlStorage} radius="sm" h={140} fit="cover" />
            ))}
          </SimpleGrid>
        </div>
      )}

      <Group justify="flex-end">
        <Text c="dimmed" size="sm">
          Criado em {new Date(checklist.criadoEm).toLocaleString('pt-BR')}
        </Text>
      </Group>
    </Stack>
  )
}
