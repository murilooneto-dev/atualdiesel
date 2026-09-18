import type { StatusOS } from '../types'

export const STATUS_OS_CONFIG: Record<StatusOS, { label: string; color: string }> = {
  ABERTA: { label: 'Aberta', color: 'blue' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'yellow' },
  AGUARDANDO_APROVACAO: { label: 'Aguardando aprovação', color: 'orange' },
  AGUARDANDO_PECA: { label: 'Aguardando peça', color: 'grape' },
  CONCLUIDA: { label: 'Aprovada', color: 'green' },
  CANCELADA: { label: 'Cancelada', color: 'red' },
}

export type StatusBarItem = {
  key: string
  label: string
  color: string
  quantidade: number
}

/**
 * Groups the raw per-status counts from /dashboard/service-orders-by-status
 * into the 3 buckets shown on the main dashboard: Em andamento, Aguardando
 * (aprovação + peça combined) and Aprovada. Aberta/Cancelada are excluded on
 * purpose - they don't belong in this summary widget.
 */
export function getDashboardGroups(byStatus: { status: string; quantidade: number }[]): StatusBarItem[] {
  const quantidadeFor = (status: StatusOS) =>
    byStatus.find((item) => item.status === status)?.quantidade ?? 0

  return [
    {
      key: 'em_andamento',
      label: STATUS_OS_CONFIG.EM_ANDAMENTO.label,
      color: STATUS_OS_CONFIG.EM_ANDAMENTO.color,
      quantidade: quantidadeFor('EM_ANDAMENTO'),
    },
    {
      key: 'aguardando',
      label: 'Aguardando',
      color: STATUS_OS_CONFIG.AGUARDANDO_APROVACAO.color,
      quantidade: quantidadeFor('AGUARDANDO_APROVACAO') + quantidadeFor('AGUARDANDO_PECA'),
    },
    {
      key: 'aprovada',
      label: STATUS_OS_CONFIG.CONCLUIDA.label,
      color: STATUS_OS_CONFIG.CONCLUIDA.color,
      quantidade: quantidadeFor('CONCLUIDA'),
    },
  ]
}

/**
 * The 3 "in progress" statuses shown ungrouped on the open-orders dashboard.
 */
export function getOpenOrdersItems(byStatus: { status: string; quantidade: number }[]): StatusBarItem[] {
  const openStatuses: StatusOS[] = ['EM_ANDAMENTO', 'AGUARDANDO_APROVACAO', 'AGUARDANDO_PECA']
  return openStatuses.map((status) => ({
    key: status,
    label: STATUS_OS_CONFIG[status].label,
    color: STATUS_OS_CONFIG[status].color,
    quantidade: byStatus.find((item) => item.status === status)?.quantidade ?? 0,
  }))
}
