import React, { useState, useEffect } from "react";
import { BarChart3, Users, FileText, AlertTriangle, FileUp, ChevronRight, Download, X } from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import NovaFaturaModal from "@/components/fatura/NovaFaturaModal";
import { useAuth } from '@/context/AuthContext';
import { useInvoice } from '@/context/InvoiceContext';
import { useCliente } from '@/context/ClienteContext';
import { useUsina } from '@/context/UsinaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { NotificationList } from '@/components/notifications/NotificationList';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  iconBgColor, 
  iconColor = "text-white", 
  change, 
  trend,
  onClick 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  iconBgColor: string;
  iconColor?: string;
  change?: string;
  trend?: "up" | "down";
  onClick?: () => void;
}) => (
  <Card className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {change && (
            <p className={`text-xs mt-2 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? "+" : ""}{change}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      {onClick && (
        <div className="flex items-center justify-end mt-4 text-xs text-muted-foreground">
          <span>Ver detalhes</span>
          <ChevronRight className="h-3 w-3 ml-1" />
        </div>
      )}
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isNovaFaturaModalOpen, setIsNovaFaturaModalOpen] = useState(false);
  const [activeTimeFrame, setActiveTimeFrame] = useState<"3M" | "6M" | "12M">("6M");
  const [dadosConectados, setDadosConectados] = useState({
    clientesAtivos: 0,
    faturasPendentes: 0,
    faturasAtrasadas: 0,
    geracaoTotal: "0 kWh",
    receitaMensal: []
  });
  const [clientesSemFaturas, setClientesSemFaturas] = useState<any[]>([]);
  const [clientesBaixados, setClientesBaixados] = useState<string[]>([]);
  const { user } = useAuth();
  const { invoices, loading: invoicesLoading } = useInvoice();
  const { clientes, loading: clientesLoading } = useCliente();
  const { usinas, loading: usinasLoading } = useUsina();

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingInvoices = invoices.filter((invoice) => invoice.status === 'pending');
  const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue');
  
  // Carregar dados reais dos outros sistemas
  useEffect(() => {
    const carregarDadosReais = () => {
      try {
        // Carregar faturas
        const faturasArmazenadas = localStorage.getItem('faturas');
        const faturas = faturasArmazenadas ? JSON.parse(faturasArmazenadas) : [];
        
        // Carregar dados financeiros
        const receitasArmazenadas = localStorage.getItem('receitas');
        const receitas = receitasArmazenadas ? JSON.parse(receitasArmazenadas) : [];
        
        // Carregar clientes baixados manualmente
        const clientesBaixadosArmazenados = localStorage.getItem('clientesBaixados');
        const clientesBaixadosData = clientesBaixadosArmazenados ? JSON.parse(clientesBaixadosArmazenados) : [];
        setClientesBaixados(clientesBaixadosData);
        
        // Identificar clientes sem faturas no mês atual
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        
        const clientesSemFaturasMes = clientes.filter((cliente) => {
          if (cliente.status !== 'ativo') return false;
          if (clientesBaixadosData.includes(cliente.id)) return false;
          
          // Verificar se tem fatura no mês atual
          const temFaturaMes = faturas.some((fatura: any) => {
            const dataFatura = new Date(fatura.dataEmissao);
            return fatura.clienteId === cliente.id && 
                   dataFatura.getMonth() === mesAtual && 
                   dataFatura.getFullYear() === anoAtual;
          });
          
          return !temFaturaMes;
        });
        
        setClientesSemFaturas(clientesSemFaturasMes);
        
        // Calcular métricas
        const clientesAtivos = clientes.filter((c) => c.status === 'ativo').length;
        const faturasPendentes = faturas.filter((f: any) => f.status === 'pendente').length;
        const faturasAtrasadas = faturas.filter((f: any) => {
          const vencimento = new Date(f.dataVencimento);
          return f.status === 'pendente' && vencimento < new Date();
        }).length;
        
        // Calcular geração total baseada no período
        const multiplicador = activeTimeFrame === "3M" ? 0.5 : activeTimeFrame === "6M" ? 1 : 2;
        const geracaoBase = usinas.length * 320; // Estimativa de 320 kWh por usina
        const geracaoTotal = `${Math.floor(geracaoBase * multiplicador).toLocaleString()} kWh`;
        
        // Calcular receita mensal
        const receitaMensal = [];
        const meses = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
        const numMeses = activeTimeFrame === "3M" ? 3 : activeTimeFrame === "6M" ? 6 : 12;
        
        for (let i = 0; i < numMeses; i++) {
          const mesIndex = i < meses.length ? i : i % meses.length;
          const valorBase = receitas.reduce((sum: number, r: any) => {
            if (r.status === 'pago') return sum + r.valor;
            return sum;
          }, 0) / numMeses;
          
          receitaMensal.push({
            name: meses[mesIndex],
            receita: Math.floor(valorBase * (1 + (Math.random() * 0.2 - 0.1)))
          });
        }
        
        setDadosConectados({
          clientesAtivos,
          faturasPendentes,
          faturasAtrasadas,
          geracaoTotal,
          receitaMensal
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Usar dados padrão em caso de erro
        setDadosConectados({
          clientesAtivos: clientes.filter(c => c.status === 'ativo').length || 0,
          faturasPendentes: 0,
          faturasAtrasadas: 0,
          geracaoTotal: `${usinas.length * 320} kWh`,
          receitaMensal: [
            { name: 'Dez', receita: 0 },
            { name: 'Jan', receita: 0 },
            { name: 'Fev', receita: 0 },
            { name: 'Mar', receita: 0 },
            { name: 'Abr', receita: 0 },
            { name: 'Mai', receita: 0 },
          ]
        });
      }
    };

    if (!clientesLoading && !usinasLoading) {
      carregarDadosReais();
    }
  }, [activeTimeFrame, clientesBaixados, clientes, usinas, clientesLoading, usinasLoading]);

  // Dados para o gráfico de pizza
  const economyData = [
    { name: "Economia", value: 100 }
  ];
  
  // Cores para o gráfico de pizza
  const COLORS = ["#22c55e", "#e4e4e7"];

  // Top clientes
  const topClientes = [
    { id: 1, nome: 'Pablio Tacyanno', economia: 'Percentual de Economia', valor: 'R$ 0,00', faturas: '0 faturas' }
  ];

  const handleClientesClick = () => {
    navigate("/clientes");
    toast({
      title: "Navegando para Clientes",
      description: "Carregando lista de clientes ativos"
    });
  };

  const handleFaturasPendentesClick = () => {
    navigate("/faturas");
    toast({
      title: "Faturas Pendentes",
      description: "Visualizando faturas que precisam de atenção"
    });
  };

  const handleFaturasAtrasadasClick = () => {
    navigate("/faturas");
    toast({
      title: "Faturas Atrasadas",
      description: "Visualizando faturas em atraso"
    });
  };

  const handleGeracaoTotalClick = () => {
    navigate("/relatorios");
    toast({
      title: "Relatório de Geração",
      description: "Visualizando detalhes de geração de energia"
    });
  };

  const handleTimeFrameChange = (timeFrame: "3M" | "6M" | "12M") => {
    setActiveTimeFrame(timeFrame);
    toast({
      title: `Período alterado para ${timeFrame}`,
      description: "Atualizando dados do gráfico",
      variant: "default"
    });
  };

  const handleClienteClick = (cliente: any) => {
    toast({
      title: `Cliente: ${cliente.nome}`,
      description: "Abrindo detalhes do cliente",
      variant: "default"
    });
    navigate(`/clientes`);
  };

  const handleBaixarCliente = (clienteId: string) => {
    const novosClientesBaixados = [...clientesBaixados, clienteId];
    setClientesBaixados(novosClientesBaixados);
    localStorage.setItem('clientesBaixados', JSON.stringify(novosClientesBaixados));
    
    toast({
      title: "Cliente baixado",
      description: "Cliente removido da lista de pendências",
      variant: "default"
    });
  };

  const handleExcluirPendencia = (clienteId: string) => {
    handleBaixarCliente(clienteId);
    toast({
      title: "Pendência excluída",
      description: "Cliente não aparecerá mais como pendente",
      variant: "default"
    });
  };

  const handleGerarFatura = (cliente: any) => {
    setIsNovaFaturaModalOpen(true);
    toast({
      title: `Gerando fatura para ${cliente.nome}`,
      description: "Abrindo modal para nova fatura",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueInvoices.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList invoices={invoices} loading={invoicesLoading} />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationList />
        </TabsContent>
      </Tabs>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da sua usina solar</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => setIsNovaFaturaModalOpen(true)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Enviar Nova Fatura
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Clientes Ativos" 
            value={dadosConectados.clientesAtivos}
            icon={Users} 
            description={`de ${dadosConectados.clientesAtivos} clientes`}
            iconBgColor="bg-green-100" 
            iconColor="text-green-600" 
            onClick={handleClientesClick}
          />
          <StatCard 
            title="Faturas Pendentes" 
            value={dadosConectados.faturasPendentes}
            icon={FileText} 
            description={`de ${dadosConectados.faturasPendentes + dadosConectados.faturasAtrasadas} faturas`}
            iconBgColor="bg-yellow-100" 
            iconColor="text-yellow-600" 
            onClick={handleFaturasPendentesClick}
          />
          <StatCard 
            title="Faturas Atrasadas" 
            value={dadosConectados.faturasAtrasadas}
            icon={AlertTriangle} 
            description="necessitam atenção" 
            iconBgColor="bg-red-100" 
            iconColor="text-red-600" 
            onClick={handleFaturasAtrasadasClick}
          />
          <StatCard 
            title="Geração Total" 
            value={dadosConectados.geracaoTotal}
            icon={BarChart3} 
            iconBgColor="bg-blue-100" 
            iconColor="text-blue-600" 
            change="12% este mês" 
            trend="up" 
            onClick={handleGeracaoTotalClick}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Receita Mensal</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={activeTimeFrame === "3M" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeFrameChange("3M")}
                  >3M</Button>
                  <Button 
                    variant={activeTimeFrame === "6M" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeFrameChange("6M")}
                  >6M</Button>
                  <Button 
                    variant={activeTimeFrame === "12M" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeFrameChange("12M")}
                  >12M</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosConectados.receitaMensal}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="receita" fill="#22c55e" name="Receita (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes sem Faturas - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] overflow-y-auto">
                {clientesSemFaturas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-500">Todos os clientes têm faturas geradas!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clientesSemFaturas.map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{cliente.nome}</h4>
                          <p className="text-xs text-gray-500">{cliente.email}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGerarFatura(cliente)}
                            className="h-8 px-2"
                          >
                            <FileUp className="h-3 w-3 mr-1" />
                            Gerar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBaixarCliente(cliente.id)}
                            className="h-8 px-2"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExcluirPendencia(cliente.id)}
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClientes.map((cliente) => (
                  <div 
                    key={cliente.id} 
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleClienteClick(cliente)}
                  >
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium mr-3">
                      {cliente.id}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{cliente.nome}</h4>
                      <p className="text-sm text-gray-500">{cliente.economia}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cliente.valor}</p>
                      <p className="text-sm text-gray-500">{cliente.faturas}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <CardTitle>Clientes em Atraso</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px] text-center">
              <div>
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500">Nenhum cliente em atraso!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NovaFaturaModal 
        isOpen={isNovaFaturaModalOpen} 
        onClose={() => setIsNovaFaturaModalOpen(false)} 
      />
    </div>
  );
};
