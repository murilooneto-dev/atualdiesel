import { Badge } from '@mantine/core'
import type { StatusOS } from '../types'

const statusConfig: Record<StatusOS, { label: string; color: string }> = {
  ABERTA: { label: 'Aberta', color: 'blue' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'yellow' },
  AGUARDANDO_APROVACAO: { label: 'Aguardando aprovação', color: 'orange' },
  AGUARDANDO_PECA: { label: 'Aguardando peça', color: 'grape' },
  CONCLUIDA: { label: 'Concluída', color: 'green' },
  CANCELADA: { label: 'Cancelada', color: 'red' },
}

export function StatusBadge({ status }: { status: StatusOS }) {
  const config = statusConfig[status]
  return (
    <Badge color={config.color} styles={{ label: { overflow: 'visible', textOverflow: 'clip' } }}>
      {config.label}
    </Badge>
  )
}
