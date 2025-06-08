import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, TrendingUp, Calendar, Clock } from "lucide-react";
import { useGeradoraAuth } from "@/context/GeradoraAuthContext";

export default function ProducaoPage() {
  const [loading, setLoading] = useState(true);
  const [producaoMensal, setProducaoMensal] = useState([]);
  const [producaoDiaria, setProducaoDiaria] = useState([]);
  const [eficienciaData, setEficienciaData] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    producaoMensal: 0,
    producaoAnual: 0,
    producaoHoje: 0,
    eficiencia: 0,
    variacaoMensal: 0,
    variacaoAnual: 0
  });
  const { geradora } = useGeradoraAuth();

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Aqui seria feita a chamada para a API real de produção de energia
        // Por enquanto, apenas inicializamos com valores vazios
        
        // Atualizar estatísticas
        setEstatisticas({
          producaoMensal: 0,
          producaoAnual: 0,
          producaoHoje: 0,
          eficiencia: 0,
          variacaoMensal: 0,
          variacaoAnual: 0
        });
        
        // Dados vazios até integração com API real
        setProducaoMensal([]);
        setProducaoDiaria([]);
        setEficienciaData([]);
      } catch (error) {
        console.error("Erro ao carregar dados de produção:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [geradora]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Produção de Energia</h1>
        <p className="text-muted-foreground">Acompanhe a produção de energia da sua usina solar</p>
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
                  {estatisticas.variacaoMensal > 0 ? '+' : ''}{estatisticas.variacaoMensal}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produção Anual</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.producaoAnual.toLocaleString()} kWh</div>
                <p className="text-xs text-muted-foreground">
                  {estatisticas.variacaoAnual > 0 ? '+' : ''}{estatisticas.variacaoAnual}% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produção Hoje</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.producaoHoje.toLocaleString()} kWh</div>
                <p className="text-xs text-muted-foreground">Dados em tempo real</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.eficiencia}%</div>
                <p className="text-xs text-muted-foreground">Dados em tempo real</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {producaoMensal.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Produção Mensal (kWh)</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={producaoMensal}>
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
                  <CardTitle>Produção Mensal (kWh)</CardTitle>
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

            {eficienciaData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Eficiência do Sistema (%)</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={eficienciaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis domain={[90, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="eficiencia" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Eficiência do Sistema (%)</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                  <p className="text-muted-foreground text-center">
                    Dados de eficiência não disponíveis.<br />
                    Conecte sua usina para visualizar estatísticas de eficiência.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {producaoDiaria.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Produção Diária (kWh)</CardTitle>
                <CardDescription>Hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={producaoDiaria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="kwh" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Produção Diária (kWh)</CardTitle>
                <CardDescription>Hoje</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[300px]">
                <p className="text-muted-foreground text-center">
                  Dados de produção diária não disponíveis.<br />
                  Conecte sua usina para visualizar estatísticas de produção em tempo real.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
