import { useMemo, useState } from 'react'
import {
  Button,
  Divider,
  FileButton,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { vehiclesService } from '../../services/vehicles'
import { checklistItemTypesService, checklistsService } from '../../services/checklist'
import type { NivelCombustivel, StatusChecklistItem } from '../../types'

const nivelOptions: { value: NivelCombustivel; label: string }[] = [
  { value: 'RESERVA', label: 'Reserva' },
  { value: 'UM_QUARTO', label: '1/4' },
  { value: 'METADE', label: '1/2' },
  { value: 'TRES_QUARTOS', label: '3/4' },
  { value: 'CHEIO', label: 'Cheio' },
]

const statusOptions: { value: StatusChecklistItem; label: string }[] = [
  { value: 'OK', label: 'OK' },
  { value: 'ATENCAO', label: 'Atenção' },
  { value: 'NAO_APLICAVEL', label: 'Não aplicável' },
]

export function NewChecklist() {
  const navigate = useNavigate()
  const [vehicleId, setVehicleId] = useState('')
  const [quilometragem, setQuilometragem] = useState<number | ''>('')
  const [nivelCombustivel, setNivelCombustivel] = useState<NivelCombustivel>('METADE')
  const [observacoesGerais, setObservacoesGerais] = useState('')
  const [itemStatus, setItemStatus] = useState<Record<string, StatusChecklistItem>>({})
  const [photos, setPhotos] = useState<File[]>([])

  const { data: vehicles } = useQuery({ queryKey: ['vehicles', 'all'], queryFn: () => vehiclesService.list() })
  const { data: itemTypes } = useQuery({
    queryKey: ['checklist-item-types'],
    queryFn: () => checklistItemTypesService.list(),
  })
  const activeItemTypes = itemTypes?.filter((item) => item.ativo)
  const groupedItemTypes = useMemo(() => {
    if (!activeItemTypes) return []
    const groups = new Map<string, typeof activeItemTypes>()
    for (const item of activeItemTypes) {
      const key = item.categoria ?? 'Outros'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(item)
    }
    return Array.from(groups.entries())
  }, [activeItemTypes])

  const createMutation = useMutation({
    mutationFn: async () => {
      const checklist = await checklistsService.create({
        vehicleId,
        quilometragem: Number(quilometragem),
        nivelCombustivel,
        observacoesGerais,
        itens: Object.entries(itemStatus).map(([checklistItemTypeId, status]) => ({
          checklistItemTypeId,
          status,
        })),
      } as never)
      for (const photo of photos) {
        await checklistsService.uploadPhoto(checklist.id, photo)
      }
      return checklist
    },
    onSuccess: (checklist) => {
      notifications.show({ message: 'Checklist registrado com sucesso.', color: 'green' })
      navigate(`/veiculos/${checklist.vehicleId}`)
    },
  })

  return (
    <Paper withBorder p="md">
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Select
            label="Veículo"
            required
            searchable
            data={vehicles?.map((v) => ({ value: v.id, label: `${v.placa} — ${v.marca} ${v.modelo}` })) ?? []}
            value={vehicleId}
            onChange={(value) => setVehicleId(value ?? '')}
          />
          <NumberInput
            label="Quilometragem"
            required
            value={quilometragem}
            onChange={(value) => setQuilometragem(value === '' ? '' : Number(value))}
          />
          <Select
            label="Nível de combustível"
            data={nivelOptions}
            value={nivelCombustivel}
            onChange={(value) => setNivelCombustivel((value as NivelCombustivel) ?? 'METADE')}
          />
        </SimpleGrid>

        <div>
          <Text fw={500} mb="xs">
            Itens verificados
          </Text>
          <Stack gap="lg">
            {groupedItemTypes.map(([categoria, items]) => (
              <div key={categoria}>
                <Divider label={categoria} labelPosition="left" mb="xs" />
                <Stack gap="xs">
                  {items.map((item) => (
                    <Group key={item.id} justify="space-between">
                      <Text size="sm">{item.nome}</Text>
                      <Select
                        data={statusOptions}
                        value={itemStatus[item.id] ?? 'OK'}
                        onChange={(value) =>
                          setItemStatus((prev) => ({ ...prev, [item.id]: (value as StatusChecklistItem) ?? 'OK' }))
                        }
                        w={180}
                      />
                    </Group>
                  ))}
                </Stack>
              </div>
            ))}
            {groupedItemTypes.length === 0 && (
              <Text size="sm" c="dimmed">
                Nenhum tipo de item cadastrado. Configure em "Configuração de itens".
              </Text>
            )}
          </Stack>
        </div>

        <Textarea
          label="Observações gerais"
          value={observacoesGerais}
          onChange={(e) => setObservacoesGerais(e.currentTarget.value)}
        />

        <div>
          <Text fw={500} mb="xs">
            Fotos do veículo
          </Text>
          <FileButton onChange={(files) => setPhotos(files)} accept="image/*" multiple>
            {(props) => (
              <Button variant="default" leftSection={<IconUpload size={16} />} {...props}>
                Selecionar fotos
              </Button>
            )}
          </FileButton>
          {photos.length > 0 && (
            <Text size="sm" c="dimmed" mt="xs">
              {photos.length} foto(s) selecionada(s)
            </Text>
          )}
        </div>

        <Group justify="flex-end">
          <Button
            onClick={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!vehicleId || quilometragem === ''}
          >
            Registrar checklist
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}
