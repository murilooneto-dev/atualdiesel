import type { StatusOS } from '../types'

export const STATUS_OS_CONFIG: Record<StatusOS, { label: string; color: string }> = {
  ABERTA: { label: 'Aberta', color: 'blue' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'yellow' },
  AGUARDANDO_APROVACAO: { label: 'Aguardando aprovação', color: 'orange' },
  AGUARDANDO_PECA: { label: 'Aguardando peça', color: 'grape' },
  CONCLUIDA: { label: 'Aprovada', color: 'green' },
  CANCELADA: { label: 'Cancelada', color: 'red' },
}

export type DashboardBucket = {
  key: string
  label: string
  color: string
  quantidade: number
  /** Leaf bucket: expanding it fetches and shows OS matching these statuses. */
  statuses?: StatusOS[]
  /** Branch bucket: expanding it shows these nested buckets instead of a list. */
  children?: DashboardBucket[]
}

/**
 * Builds the 3 top-level dashboard buckets (Aberto / Em Andamento / Concluído)
 * from the raw per-status counts returned by /dashboard/service-orders-by-status.
 * "Em Andamento" is a branch with 3 children (Em execução, Aguardando
 * aprovação, Aguardando peça); its own quantidade is the sum of its children.
 * Cancelada is intentionally excluded from the main dashboard.
 */
export function getDashboardBuckets(byStatus: { status: string; quantidade: number }[]): DashboardBucket[] {
  const quantidadeFor = (status: StatusOS) =>
    byStatus.find((item) => item.status === status)?.quantidade ?? 0

  const emExecucao: DashboardBucket = {
    key: 'em_execucao',
    label: 'Em execução',
    color: STATUS_OS_CONFIG.EM_ANDAMENTO.color,
    quantidade: quantidadeFor('EM_ANDAMENTO'),
    statuses: ['EM_ANDAMENTO'],
  }
  const aguardandoAprovacao: DashboardBucket = {
    key: 'aguardando_aprovacao',
    label: STATUS_OS_CONFIG.AGUARDANDO_APROVACAO.label,
    color: STATUS_OS_CONFIG.AGUARDANDO_APROVACAO.color,
    quantidade: quantidadeFor('AGUARDANDO_APROVACAO'),
    statuses: ['AGUARDANDO_APROVACAO'],
  }
  const aguardandoPeca: DashboardBucket = {
    key: 'aguardando_peca',
    label: STATUS_OS_CONFIG.AGUARDANDO_PECA.label,
    color: STATUS_OS_CONFIG.AGUARDANDO_PECA.color,
    quantidade: quantidadeFor('AGUARDANDO_PECA'),
    statuses: ['AGUARDANDO_PECA'],
  }

  return [
    {
      key: 'aberto',
      label: STATUS_OS_CONFIG.ABERTA.label,
      color: STATUS_OS_CONFIG.ABERTA.color,
      quantidade: quantidadeFor('ABERTA'),
      statuses: ['ABERTA'],
    },
    {
      key: 'em_andamento',
      label: 'Em Andamento',
      color: STATUS_OS_CONFIG.EM_ANDAMENTO.color,
      quantidade: emExecucao.quantidade + aguardandoAprovacao.quantidade + aguardandoPeca.quantidade,
      children: [emExecucao, aguardandoAprovacao, aguardandoPeca],
    },
    {
      key: 'concluido',
      label: 'Concluído',
      color: STATUS_OS_CONFIG.CONCLUIDA.color,
      quantidade: quantidadeFor('CONCLUIDA'),
      statuses: ['CONCLUIDA'],
    },
  ]
}
