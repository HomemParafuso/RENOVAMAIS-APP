import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Users, TrendingUp, DollarSign, Factory } from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { useGeradoraAuth } from "@/context/GeradoraAuthContext";
import { useUsina } from "@/context/UsinaContext";

export default function GeradoraDashboard() {
  const [loading, setLoading] = useState(true);
  const [clientesData, setClientesData] = useState([]);
  const [producaoData, setProducaoData] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    producaoMensal: 0,
    clientesAtivos: 0,
    usinasAtivas: 0,
    receitaMensal: 0,
    eficiencia: 0,
    variacaoProducao: 0,
    variacaoClientes: 0,
    variacaoReceita: 0
  });
  const { geradora, loading: geradoraAuthLoading } = useGeradoraAuth();
  const { usinas, loading: usinasLoading } = useUsina();

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        if (geradora?.id) {
          // Carregar e filtrar clientes
          const todosClientes = await clienteService.getAll();
          const clientes = todosClientes.filter(c => c.geradoraId === geradora.id);
          const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;

          // Calcular estatísticas de usinas
          const usinasAtivas = usinas.filter(u => u.status === 'ativo').length;
          const producaoMensalTotal = usinas.reduce((sum, usina) => sum + (usina.producaoMensalKWh || 0), 0);

          // Preparar dados para o gráfico de distribuição de clientes
          const clientesDistribuicao = [
            { name: 'Ativos', value: clientesAtivos, color: '#10b981' },
            { name: 'Pendentes', value: clientes.filter(c => c.status === 'pendente').length, color: '#f59e0b' },
            { name: 'Inativos', value: clientes.filter(c => c.status === 'inativo').length, color: '#ef4444' }
          ];

          setClientesData(clientesDistribuicao);

          // Atualizar estatísticas
          setEstatisticas({
            producaoMensal: producaoMensalTotal,
            clientesAtivos,
            usinasAtivas,
            receitaMensal: 0, // Será preenchido com dados reais da API
            eficiencia: 0, // Será preenchido com dados reais da API
            variacaoProducao: 0,
            variacaoClientes: 0,
            variacaoReceita: 0
          });

          // Dados de produção vazios até integração com API real
          setProducaoData([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!usinasLoading && !geradoraAuthLoading) { // Esperar usinas e geradora autenticada
      carregarDados();
    }
  }, [geradora, usinas, usinasLoading, geradoraAuthLoading]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard da Geradora</h1>
        <p className="text-muted-foreground">Visão geral da sua usina solar</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produção Mensal</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.producaoMensal.toLocaleString()} kWh</div>
                <p className="text-xs text-muted-foreground">
                  {estatisticas.variacaoProducao > 0 ? '+' : ''}{estatisticas.variacaoProducao}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usinas Ativas</CardTitle>
                <Factory className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.usinasAtivas}</div>
                <p className="text-xs text-muted-foreground">
                  Usinas ativas em sua rede
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.clientesAtivos}</div>
                <p className="text-xs text-muted-foreground">
                  {estatisticas.variacaoClientes > 0 ? '+' : ''}{estatisticas.variacaoClientes} novos clientes este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {estatisticas.receitaMensal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {estatisticas.variacaoReceita > 0 ? '+' : ''}{estatisticas.variacaoReceita}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {producaoData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Produção de Energia (kWh)</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={producaoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="kwh" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Produção de Energia (kWh)</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                  <p className="text-muted-foreground text-center">
                    Dados de produção não disponíveis.<br />
                    Conecte sua usina para visualizar estatísticas de produção.
                  </p>
                </CardContent>
              </Card>
            )}

            {clientesData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Clientes</CardTitle>
                  <CardDescription>Status atual dos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {clientesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Clientes</CardTitle>
                  <CardDescription>Status atual dos clientes</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                  <p className="text-muted-foreground text-center">
                    Nenhum cliente cadastrado.<br />
                    Adicione clientes para visualizar estatísticas.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
