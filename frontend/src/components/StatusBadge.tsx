import { Badge } from '@mantine/core'
import type { StatusOS } from '../types'
import { STATUS_OS_CONFIG } from '../utils/statusOs'

export function StatusBadge({ status }: { status: StatusOS }) {
  const config = STATUS_OS_CONFIG[status]
  return (
    <Badge color={config.color} styles={{ label: { overflow: 'visible', textOverflow: 'clip' } }}>
      {config.label}
    </Badge>
  )
}
