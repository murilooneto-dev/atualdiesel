export type Role = 'ADMIN' | 'GERENTE' | 'MECANICO'

export interface Profile {
  id: string
  nome: string
  email: string
  papel: Role
  ativo: boolean
  criadoEm: string
}

export type TipoPessoa = 'PF' | 'PJ'

export interface Client {
  id: string
  nome: string
  tipoPessoa: TipoPessoa
  cpfCnpj?: string | null
  telefone?: string | null
  email?: string | null
  rua?: string | null
  numero?: string | null
  bairro?: string | null
  cidade?: string | null
  uf?: string | null
  cep?: string | null
  observacoes?: string | null
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export type Combustivel = 'GASOLINA' | 'ETANOL' | 'FLEX' | 'DIESEL' | 'GNV' | 'ELETRICO' | 'HIBRIDO'

export interface Vehicle {
  id: string
  clientId: string
  client?: Client
  placa: string
  marca: string
  modelo: string
  ano?: number | null
  cor?: string | null
  quilometragemAtual?: number | null
  combustivel: Combustivel
  chassi?: string | null
  observacoes?: string | null
  ativo: boolean
  criadoEm: string
}

export interface Service {
  id: string
  nome: string
  descricao?: string | null
  valorPadrao: number
  ativo: boolean
  criadoEm: string
}

export interface ChecklistItemType {
  id: string
  nome: string
  categoria?: string | null
  ativo: boolean
}

export type StatusChecklistItem = 'OK' | 'ATENCAO' | 'NAO_APLICAVEL'
export type NivelCombustivel = 'RESERVA' | 'UM_QUARTO' | 'METADE' | 'TRES_QUARTOS' | 'CHEIO'

export interface EntryChecklistItem {
  id: string
  checklistItemTypeId: string
  checklistItemType?: ChecklistItemType
  status: StatusChecklistItem
  observacao?: string | null
}

export interface EntryChecklistPhoto {
  id: string
  urlStorage: string
  descricao?: string | null
  criadoEm: string
}

export interface EntryChecklist {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  serviceOrderId?: string | null
  quilometragem: number
  nivelCombustivel: NivelCombustivel
  observacoesGerais?: string | null
  criadoPor: string
  criadoEm: string
  itens: EntryChecklistItem[]
  fotos: EntryChecklistPhoto[]
}

export type StatusOS =
  | 'ABERTA'
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_APROVACAO'
  | 'AGUARDANDO_PECA'
  | 'CONCLUIDA'
  | 'CANCELADA'

export interface ServiceOrderItem {
  id: string
  serviceId: string
  service?: Service
  descricao: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
}

export interface ServiceOrder {
  id: string
  numeroOs: number
  clientId: string
  client?: Client
  vehicleId: string
  vehicle?: Vehicle
  entryChecklistId?: string | null
  status: StatusOS
  dataAbertura: string
  dataPrevisao?: string | null
  dataConclusao?: string | null
  valorTotal: number
  observacoes?: string | null
  criadoPor: string
  atualizadoEm: string
  itens: ServiceOrderItem[]
}

export interface DashboardSummary {
  totalClientes: number
  totalVeiculos: number
  osAbertas: number
  osFinalizadasMes: number
  faturamentoMes: number
}
