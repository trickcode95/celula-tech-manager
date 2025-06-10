
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtapptjrzzofqyovlkza.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0YXBwdGpyenpvZnF5b3Zsa3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTU1NzQsImV4cCI6MjA2NTEzMTU3NH0.TTTljSGVl4B8UD08W4wIXERmr47jumnCwcMpkT32SgM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para as tabelas
export interface Cliente {
  id: number
  nome: string
  telefone: string
  email?: string
  endereco?: string
  created_at?: string
}

export interface Tecnico {
  id: number
  nome: string
  especialidade: string
  created_at?: string
}

export interface Servico {
  id: number
  nome: string
  descricao?: string
  preco: number
  created_at?: string
}

export interface OrdemServico {
  id: number
  cliente_id: number
  tecnico_id?: number
  status: 'aberta' | 'em andamento' | 'concluída' | 'cancelada'
  descricao_problema: string
  diagnostico?: string
  solucao?: string
  data_abertura: string
  data_conclusao?: string
  valor_total: number
  garantia_meses?: number
  created_at?: string
}

export interface OrdemServicoItem {
  id: number
  ordem_id: number
  servico_id: number
  quantidade: number
  preco_unitario: number
  subtotal: number
}

export interface OrdemDetalhada {
  id: number
  cliente_id: number
  cliente_nome: string
  cliente_telefone: string
  tecnico_id?: number
  tecnico_nome?: string
  tecnico_especialidade?: string
  status: string
  descricao_problema: string
  diagnostico?: string
  solucao?: string
  data_abertura: string
  data_conclusao?: string
  valor_total: number
  garantia_meses?: number
  itens: Array<{
    servico_nome: string
    quantidade: number
    preco_unitario: number
    subtotal: number
  }>
}
