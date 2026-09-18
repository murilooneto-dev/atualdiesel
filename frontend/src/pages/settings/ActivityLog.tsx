import { useQuery } from '@tanstack/react-query'
import { Badge, Paper } from '@mantine/core'
import { DataTable } from '../../components/DataTable'
import { auditService } from '../../services/audit'
import type { AuditAcao, AuditLog } from '../../types'

const entidadeLabels: Record<string, string> = {
  Client: 'Cliente',
  Vehicle: 'Veículo',
  Service: 'Serviço',
  ChecklistItemType: 'Tipo de item de checklist',
  EntryChecklist: 'Checklist',
  ServiceOrder: 'Ordem de serviço',
  ServiceOrderItem: 'Item de OS',
  Profile: 'Usuário',
}

const acaoConfig: Record<AuditAcao, { label: string; color: string }> = {
  CRIACAO: { label: 'Criação', color: 'green' },
  ATUALIZACAO: { label: 'Atualização', color: 'blue' },
  EXCLUSAO: { label: 'Exclusão', color: 'red' },
}

export function ActivityLog() {
  const { data, isLoading } = useQuery({ queryKey: ['audit-logs'], queryFn: () => auditService.list({ limit: 300 }) })

  return (
    <Paper withBorder p="md">
      <DataTable<AuditLog>
        data={data}
        loading={isLoading}
        emptyMessage="Nenhuma atividade registrada ainda."
        columns={[
          {
            header: 'Data/Hora',
            render: (row) => new Date(row.criadoEm).toLocaleString('pt-BR'),
          },
          { header: 'Usuário', render: (row) => row.usuario?.nome ?? 'Sistema' },
          {
            header: 'Ação',
            render: (row) => <Badge color={acaoConfig[row.acao].color}>{acaoConfig[row.acao].label}</Badge>,
          },
          { header: 'Entidade', render: (row) => entidadeLabels[row.entidade] ?? row.entidade },
        ]}
      />
    </Paper>
  )
}
