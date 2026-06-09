export interface Disciplina {
  id: string
  nome: string
  nota: number
  ch: number
  createdAt: number
}

export interface HistoricoItem {
  id: string
  nome: string
  nota: number
  ch: number
  tipo: 'media' | 'cr'
  situacao?: string
  ts: number
}

export interface ConfigAprovacao {
  minAprovado: number
  minRecuperacao: number
}

export interface PesosAV {
  p1: number
  p2: number
  p3: number
}

export type TabId = 'dashboard' | 'media' | 'cr' | 'historico'

export type Situacao = 'Aprovado' | 'Recuperação' | 'Reprovado'
