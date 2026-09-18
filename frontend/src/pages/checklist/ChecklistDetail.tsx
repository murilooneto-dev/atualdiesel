import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Badge,
  Button,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconDownload, IconEdit, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
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

const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({ value, label: config.label }))

export function ChecklistDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [itemEdits, setItemEdits] = useState<Record<string, { status: StatusChecklistItem; observacao: string }>>({})

  const { data: checklist } = useQuery({
    queryKey: ['checklists', id],
    queryFn: () => checklistsService.get(id!),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: () =>
      checklistsService.update(id!, {
        itens: Object.entries(itemEdits).map(([itemId, edit]) => ({ id: itemId, ...edit })),
      } as never),
    onSuccess: () => {
      notifications.show({ message: 'Checklist atualizado com sucesso.', color: 'green' })
      queryClient.invalidateQueries({ queryKey: ['checklists', id] })
      setEditing(false)
    },
  })

  const startEditing = () => {
    if (!checklist) return
    setItemEdits(
      Object.fromEntries(
        checklist.itens.map((item) => [item.id, { status: item.status, observacao: item.observacao ?? '' }]),
      ),
    )
    setEditing(true)
  }

  if (!checklist) return null

  return (
    <Stack gap="lg">
      <PageHeader
        title={`Checklist #${checklist.numeroChecklist} — ${checklist.vehicle?.placa ?? ''}`}
        action={
          <Group gap="sm">
            {editing ? (
              <>
                <Button variant="default" leftSection={<IconX size={16} />} onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
                <Button loading={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
                  Salvar alterações
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" leftSection={<IconEdit size={16} />} onClick={startEditing}>
                  Editar
                </Button>
                <Button
                  variant="default"
                  leftSection={<IconDownload size={16} />}
                  onClick={() => checklistsService.openPdf(checklist.id)}
                >
                  Gerar PDF
                </Button>
              </>
            )}
          </Group>
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
                    {editing ? (
                      <Select
                        data={statusOptions}
                        value={itemEdits[item.id]?.status ?? item.status}
                        onChange={(value) =>
                          setItemEdits((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], status: (value as StatusChecklistItem) ?? item.status },
                          }))
                        }
                        w={180}
                      />
                    ) : (
                      <Badge
                        color={statusConfig[item.status].color}
                        styles={{ label: { overflow: 'visible', textOverflow: 'clip' } }}
                      >
                        {statusConfig[item.status].label}
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {editing ? (
                      <TextInput
                        value={itemEdits[item.id]?.observacao ?? ''}
                        onChange={(e) =>
                          setItemEdits((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], observacao: e.currentTarget.value },
                          }))
                        }
                      />
                    ) : (
                      item.observacao ?? '-'
                    )}
                  </Table.Td>
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
          {checklist.atualizadoEm && ` · Alterado em ${new Date(checklist.atualizadoEm).toLocaleString('pt-BR')}`}
        </Text>
      </Group>
    </Stack>
  )
}
