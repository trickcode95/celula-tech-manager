
import { useEffect, useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase, type OrdemDetalhada } from '@/lib/supabase'
import { FileText, Clock, CheckCircle, XCircle, Users, Wrench, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface DashboardStats {
  ordensAbertas: number
  ordensAndamento: number
  ordensConcluidas: number
  ordensCanceladas: number
  totalClientes: number
  totalTecnicos: number
  faturamentoMes: number
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    ordensAbertas: 0,
    ordensAndamento: 0,
    ordensConcluidas: 0,
    ordensCanceladas: 0,
    totalClientes: 0,
    totalTecnicos: 0,
    faturamentoMes: 0
  })
  const [ordensRecentes, setOrdensRecentes] = useState<OrdemDetalhada[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar estatísticas das ordens
      const { data: ordens } = await supabase
        .from('ordens_servico')
        .select('status, valor_total, data_abertura')

      // Buscar total de clientes
      const { count: totalClientes } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })

      // Buscar total de técnicos
      const { count: totalTecnicos } = await supabase
        .from('tecnicos')
        .select('*', { count: 'exact', head: true })

      // Buscar ordens recentes (VIEW)
      const { data: ordensRecentesData } = await supabase
        .from('ordem_detalhada')
        .select('*')
        .order('data_abertura', { ascending: false })
        .limit(5)

      if (ordens) {
        const ordensAbertas = ordens.filter(o => o.status === 'aberta').length
        const ordensAndamento = ordens.filter(o => o.status === 'em andamento').length
        const ordensConcluidas = ordens.filter(o => o.status === 'concluída').length
        const ordensCanceladas = ordens.filter(o => o.status === 'cancelada').length
        
        // Calcular faturamento do mês atual
        const mesAtual = new Date().getMonth()
        const anoAtual = new Date().getFullYear()
        const faturamentoMes = ordens
          .filter(o => {
            const dataOrdem = new Date(o.data_abertura)
            return dataOrdem.getMonth() === mesAtual && 
                   dataOrdem.getFullYear() === anoAtual &&
                   o.status === 'concluída'
          })
          .reduce((total, o) => total + o.valor_total, 0)

        setStats({
          ordensAbertas,
          ordensAndamento,
          ordensConcluidas,
          ordensCanceladas,
          totalClientes: totalClientes || 0,
          totalTecnicos: totalTecnicos || 0,
          faturamentoMes
        })
      }

      if (ordensRecentesData) {
        setOrdensRecentes(ordensRecentesData)
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'aberta': 'secondary',
      'em andamento': 'default',
      'concluída': 'default',
      'cancelada': 'destructive'
    } as const

    const colors = {
      'aberta': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'em andamento': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'concluída': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelada': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    } as const

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da assistência técnica</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da assistência técnica</p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ordens Abertas"
          value={stats.ordensAbertas}
          icon={FileText}
          description="Aguardando atendimento"
        />
        <StatCard
          title="Em Andamento"
          value={stats.ordensAndamento}
          icon={Clock}
          description="Sendo processadas"
        />
        <StatCard
          title="Concluídas"
          value={stats.ordensConcluidas}
          icon={CheckCircle}
          description="Finalizadas com sucesso"
        />
        <StatCard
          title="Faturamento do Mês"
          value={`R$ ${stats.faturamentoMes.toFixed(2)}`}
          icon={DollarSign}
          description="Receita do mês atual"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ordens Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ordens Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordensRecentes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma ordem encontrada
                </p>
              ) : (
                ordensRecentes.map((ordem) => (
                  <div key={ordem.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{ordem.id}</span>
                        {getStatusBadge(ordem.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{ordem.cliente_nome}</p>
                      <p className="text-xs text-muted-foreground">{ordem.descricao_problema}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {ordem.valor_total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ordem.data_abertura).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {ordensRecentes.length > 0 && (
                <Link 
                  to="/ordens" 
                  className="block text-center text-sm text-primary hover:underline mt-4"
                >
                  Ver todas as ordens
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Geral */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total de Clientes</span>
                </div>
                <span className="font-medium">{stats.totalClientes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Técnicos Cadastrados</span>
                </div>
                <span className="font-medium">{stats.totalTecnicos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ordens Canceladas</span>
                </div>
                <span className="font-medium">{stats.ordensCanceladas}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
