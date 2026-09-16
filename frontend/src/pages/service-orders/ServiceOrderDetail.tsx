import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { serviceOrdersService } from '../../services/serviceOrders'
import { servicesService } from '../../services/services'
import { StatusBadge } from '../../components/StatusBadge'
import { PageHeader } from '../../components/PageHeader'
import type { StatusOS } from '../../types'
import { usePermissions } from '../../hooks/usePermissions'

const statusOptions: { value: StatusOS; label: string }[] = [
  { value: 'ABERTA', label: 'Aberta' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'AGUARDANDO_APROVACAO', label: 'Aguardando aprovação' },
  { value: 'AGUARDANDO_PECA', label: 'Aguardando peça' },
  { value: 'CONCLUIDA', label: 'Concluída' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

export function ServiceOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { hasRole } = usePermissions()
  const canEdit = hasRole('ADMIN', 'GERENTE', 'MECANICO')
  const canFinalize = hasRole('ADMIN', 'GERENTE')

  const [serviceId, setServiceId] = useState<string | null>(null)
  const [quantidade, setQuantidade] = useState<number>(1)

  const { data: os } = useQuery({
    queryKey: ['service-orders', id],
    queryFn: () => serviceOrdersService.get(id!),
    enabled: !!id,
  })

  const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => servicesService.list() })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['service-orders', id] })

  const addItemMutation = useMutation({
    mutationFn: () => {
      const service = services?.find((s) => s.id === serviceId)
      return serviceOrdersService.addItem(id!, {
        serviceId: serviceId!,
        descricao: service?.nome ?? '',
        quantidade,
        valorUnitario: service?.valorPadrao ?? 0,
      })
    },
    onSuccess: () => {
      notifications.show({ message: 'Serviço adicionado à OS.', color: 'green' })
      setServiceId(null)
      setQuantidade(1)
      invalidate()
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => serviceOrdersService.removeItem(id!, itemId),
    onSuccess: invalidate,
  })

  const statusMutation = useMutation({
    mutationFn: (status: StatusOS) => serviceOrdersService.updateStatus(id!, status),
    onSuccess: () => {
      notifications.show({ message: 'Status atualizado.', color: 'green' })
      invalidate()
    },
  })

  const finalizeMutation = useMutation({
    mutationFn: () => serviceOrdersService.finalize(id!),
    onSuccess: () => {
      notifications.show({ message: 'OS finalizada.', color: 'green' })
      invalidate()
    },
  })

  if (!os) return null

  return (
    <Stack gap="lg">
      <PageHeader
        title={`OS #${os.numeroOs}`}
        action={
          <Group>
            <Button
              variant="default"
              leftSection={<IconDownload size={16} />}
              onClick={() => serviceOrdersService.openPdf(os.id)}
            >
              Gerar PDF
            </Button>
            {canFinalize && os.status !== 'CONCLUIDA' && (
              <Button onClick={() => finalizeMutation.mutate()} loading={finalizeMutation.isPending}>
                Finalizar OS
              </Button>
            )}
          </Group>
        }
      />

      <Paper withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }}>
          <div>
            <Text size="xs" c="dimmed">Cliente</Text>
            <Text>{os.client?.nome ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Veículo</Text>
            <Text>{os.vehicle?.placa ?? '-'}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Status</Text>
            {canEdit ? (
              <Select
                data={statusOptions}
                value={os.status}
                onChange={(value) => value && statusMutation.mutate(value as StatusOS)}
                w={220}
              />
            ) : (
              <StatusBadge status={os.status} />
            )}
          </div>
          <div>
            <Text size="xs" c="dimmed">Valor total</Text>
            <Text fw={700}>{os.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
          </div>
        </SimpleGrid>
      </Paper>

      <div>
        <Title order={4} mb="sm">Serviços</Title>
        <Paper withBorder p="md">
          <Table striped withTableBorder mb="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Descrição</Table.Th>
                <Table.Th>Qtd</Table.Th>
                <Table.Th>Valor unitário</Table.Th>
                <Table.Th>Total</Table.Th>
                {canEdit && <Table.Th />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {os.itens.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.descricao}</Table.Td>
                  <Table.Td>{item.quantidade}</Table.Td>
                  <Table.Td>{item.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Td>
                  <Table.Td>{item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Td>
                  {canEdit && (
                    <Table.Td>
                      <ActionIcon variant="subtle" color="red" onClick={() => removeItemMutation.mutate(item.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
              {os.itens.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text c="dimmed" size="sm">Nenhum serviço adicionado.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          {canEdit && (
            <Group align="flex-end">
              <Select
                label="Serviço"
                data={services?.map((s) => ({ value: s.id, label: s.nome })) ?? []}
                value={serviceId}
                onChange={setServiceId}
                w={280}
              />
              <NumberInput label="Quantidade" min={1} value={quantidade} onChange={(v) => setQuantidade(Number(v) || 1)} w={120} />
              <Button onClick={() => addItemMutation.mutate()} loading={addItemMutation.isPending} disabled={!serviceId}>
                Adicionar
              </Button>
            </Group>
          )}
        </Paper>
      </div>
    </Stack>
  )
}
