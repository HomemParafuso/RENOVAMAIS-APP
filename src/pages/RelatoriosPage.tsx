
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, DollarSign, Users, BarChart2, Zap, Calendar, CalendarRange, Loader2, ArrowDown, ArrowUp } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { fetchGrowattEnergyData, fetchGrowattPlantData, formatMonthlyDataForChart, formatDataByUsina } from "@/utils/growattApi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Geradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  status: string;
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
}

interface Cliente {
  id: number;
  nome: string;
  consumoMedio: number;
  economiaGerada: number;
  receitaTotal: number;
  faturasPendentes: number;
  dataAdesao: string;
}

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState("6M");
  const [dataInicio, setDataInicio] = useState<Date>(() => {
    // Definir data inicial baseada no período selecionado
    return subMonths(new Date(), 6);
  });
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("financeiro");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Estados para os dados dos gráficos
  const [receitaData, setReceitaData] = useState([]);
  const [despesasData, setDespesasData] = useState([]);
  const [geracaoData, setGeracaoData] = useState([]);
  const [geracaoPorUsinaData, setGeracaoPorUsinaData] = useState([]);
  const [geradoras, setGeradoras] = useState<Geradora[]>([]);
  
  // Dados para a aba de clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: keyof Cliente, direction: 'ascending' | 'descending'} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientesPorPagina = 5;

  // Efeito para atualizar data de início quando o período mudar
  useEffect(() => {
    let novaDataInicio;
    
    switch(periodo) {
      case "3M":
        novaDataInicio = subMonths(new Date(), 3);
        break;
      case "6M":
        novaDataInicio = subMonths(new Date(), 6);
        break;
      case "12M":
        novaDataInicio = subMonths(new Date(), 12);
        break;
      default:
        novaDataInicio = subMonths(new Date(), 6);
    }
    
    setDataInicio(novaDataInicio);
  }, [periodo]);

  // Busca geradoras cadastradas ao carregar a página
  useEffect(() => {
    const carregarGeradoras = async () => {
      try {
        // Em um cenário real, isso seria uma chamada API
        // Aqui estamos simulando com dados do localStorage se disponível
        const geradorasArmazenadas = localStorage.getItem('geradoras');
        if (geradorasArmazenadas) {
          setGeradoras(JSON.parse(geradorasArmazenadas));
        } else {
          // Dados de exemplo se não houver nada no localStorage
          setGeradoras([{
            id: 1,
            nome: "Usina Solar São Paulo I",
            potencia: "500 kWp",
            localizacao: "São Paulo, SP",
            status: "Ativo",
            clientesVinculados: 25,
            marcaInversor: "growatt",
            apiKey: "abc12345"
          }]);
        }
      } catch (error) {
        console.error("Erro ao carregar geradoras:", error);
      }
    };

    carregarGeradoras();
    carregarDadosClientes();
  }, []);

  // Função para carregar dados dos clientes
  const carregarDadosClientes = () => {
    // Em um caso real, esses dados viriam de uma API
    const clientesMock: Cliente[] = [
      {
        id: 1,
        nome: "Pablio Tacyanno",
        consumoMedio: 350,
        economiaGerada: 1200,
        receitaTotal: 5800,
        faturasPendentes: 1,
        dataAdesao: "10/12/2024"
      },
      {
        id: 2,
        nome: "Maria Empreendimentos",
        consumoMedio: 620,
        economiaGerada: 2100,
        receitaTotal: 8900,
        faturasPendentes: 0,
        dataAdesao: "22/01/2025"
      },
      {
        id: 3,
        nome: "João Comércio Ltda",
        consumoMedio: 480,
        economiaGerada: 1800,
        receitaTotal: 7200,
        faturasPendentes: 2,
        dataAdesao: "05/11/2024"
      },
      {
        id: 4,
        nome: "Supermercado Bom Preço",
        consumoMedio: 950,
        economiaGerada: 3200,
        receitaTotal: 12500,
        faturasPendentes: 0,
        dataAdesao: "15/09/2024"
      },
      {
        id: 5,
        nome: "Clínica Saúde Plena",
        consumoMedio: 320,
        economiaGerada: 1100,
        receitaTotal: 4800,
        faturasPendentes: 0,
        dataAdesao: "18/03/2025"
      },
      {
        id: 6,
        nome: "Academia Fitness Total",
        consumoMedio: 580,
        economiaGerada: 1950,
        receitaTotal: 7600,
        faturasPendentes: 1,
        dataAdesao: "02/02/2025"
      },
      {
        id: 7,
        nome: "Restaurante Sabor Caseiro",
        consumoMedio: 420,
        economiaGerada: 1450,
        receitaTotal: 6200,
        faturasPendentes: 0,
        dataAdesao: "28/10/2024"
      }
    ];
    
    setClientes(clientesMock);
  };

  // Função para ordenar clientes
  const sortClientes = (key: keyof Cliente) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Obter os clientes ordenados
  const getSortedClientes = () => {
    if (!sortConfig) return clientes;
    
    return [...clientes].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Calcular clientes para a página atual
  const indexUltimoCliente = currentPage * clientesPorPagina;
  const indexPrimeiroCliente = indexUltimoCliente - clientesPorPagina;
  const clientesAtuais = getSortedClientes().slice(indexPrimeiroCliente, indexUltimoCliente);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  // Função para buscar dados reais da API baseado nas geradoras cadastradas
  const buscarDadosReais = async () => {
    setIsLoading(true);
    
    try {
      // Verificar se temos geradoras com API key do Growatt
      const geradorasGrowatt = geradoras.filter(g => 
        g.marcaInversor?.toLowerCase() === "growatt" && 
        g.apiKey && 
        g.apiKey.length > 5
      );

      if (geradorasGrowatt.length > 0) {
        console.log("Encontradas geradoras Growatt com API key:", geradorasGrowatt.length);
        
        // Usar a primeira geradora Growatt encontrada para buscar dados
        const geradora = geradorasGrowatt[0];
        console.log("Usando geradora para API:", geradora.nome, "com API key:", geradora.apiKey);
        
        // Converter datas para o formato esperado pela API (YYYY-MM-DD)
        const formatarData = (data: Date) => format(data, "yyyy-MM-dd");
        const dataInicioFormatada = formatarData(dataInicio);
        const dataFimFormatada = formatarData(dataFim);
        
        // Buscar dados de energia mensal
        const dadosMensais = await fetchGrowattEnergyData(
          geradora.apiKey!,
          "12345", // Plant ID (em um caso real, seria obtido de uma chamada anterior)
          "month",
          dataInicioFormatada,
          dataFimFormatada
        );
        
        console.log("Dados mensais obtidos:", dadosMensais);
        
        // Formatar dados para uso nos gráficos
        const dadosFormatados = formatMonthlyDataForChart(dadosMensais);
        setGeracaoData(dadosFormatados);
        
        // Simular dados por usina (em um caso real, faríamos múltiplas chamadas)
        const dadosPorUsina = formatDataByUsina(dadosFormatados, geradora.nome);
        setGeracaoPorUsinaData(dadosPorUsina);
        
        // Derivar dados financeiros a partir dos dados de geração
        const receitasCalculadas = dadosFormatados.map(item => ({
          mes: item.mes,
          valor: Math.floor(item.valor * 0.8) // 80% da geração como receita
        }));
        
        // Simular dados de despesas (em um caso real, seriam carregados do banco)
        const despesasCalculadas = dadosFormatados.map(item => ({
          mes: item.mes,
          valor: Math.floor(item.valor * 0.3) // 30% da geração como despesa (simulado)
        }));
        
        setReceitaData(receitasCalculadas);
        setDespesasData(despesasCalculadas);
        
        toast({
          title: "Dados reais carregados",
          description: `Relatórios atualizados com dados reais da API Growatt para período de ${periodo}.`,
          variant: "default"
        });
      } else {
        console.log("Nenhuma geradora Growatt com API key encontrada, usando dados simulados");
        
        // Fallback para dados simulados caso não tenhamos geradoras com API key
        const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth();
        
        // Simular dados de geração por mês (em kWh)
        const dadosGeracao = [];
        const dadosGeradoraPorUsina = [];
        
        // Calcular quantos meses queremos baseado no periodo selecionado
        let numMeses = 6; // padrão para 6M
        if (periodo === "3M") numMeses = 3;
        if (periodo === "12M") numMeses = 12;
        
        // Gerar dados para os últimos N meses
        for (let i = 0; i < numMeses; i++) {
          const mesIndex = (mesAtual - i + 12) % 12; // Garantir que não fique negativo
          const mes = meses[mesIndex];
          const anoMes = mesIndex > mesAtual ? (anoAtual - 1) : anoAtual;
          const mesFormatado = `${mes}/${String(anoMes).substring(2)}`;
          
          // Gerar um valor com alguma variação para simular dados reais
          const valorBase = 14000 + Math.floor(Math.random() * 3000 - 1000);
          
          dadosGeracao.push({
            mes: mesFormatado,
            valor: valorBase
          });
          
          // Para cada geradora, adicionar uma entrada no gráfico por usina
          const entradaPorUsina: any = { mes: mesFormatado };
          geradoras.forEach(geradora => {
            // Distribuir a geração total entre as usinas com alguma variação
            const fatorUsina = geradora.id === 1 ? 0.65 : 0.35; // Uma usina gera mais que a outra
            entradaPorUsina[geradora.nome] = Math.floor(valorBase * fatorUsina * (1 + (Math.random() * 0.2 - 0.1)));
          });
          
          dadosGeradoraPorUsina.push(entradaPorUsina);
        }
        
        // Inverter os arrays para que os dados mais antigos apareçam primeiro
        setGeracaoData(dadosGeracao.reverse());
        setGeracaoPorUsinaData(dadosGeradoraPorUsina.reverse());
        
        // Simular dados financeiros relacionados
        const receitasSimuladas = dadosGeracao.map(item => ({
          mes: item.mes,
          valor: Math.floor(item.valor * 0.8) // Simplificação: receita é 80% da geração
        }));
        
        const despesasSimuladas = dadosGeracao.map(item => ({
          mes: item.mes,
          valor: Math.floor(item.valor * 0.3) // Simplificação: despesas são 30% da geração
        }));
        
        setReceitaData(receitasSimuladas);
        setDespesasData(despesasSimuladas);
        
        toast({
          title: "Dados atualizados",
          description: `Relatórios atualizados com dados simulados para o período de ${periodo}.`,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível obter dados das APIs dos inversores. Usando dados simulados.",
        variant: "destructive"
      });
      
      // Exibir o erro no console para debug
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para carregar dados quando o período muda
  useEffect(() => {
    buscarDadosReais();
  }, [periodo, dataInicio, dataFim]);

  // Função para mudar o período
  const handleChangePeriodo = (novoPeriodo: string) => {
    setPeriodo(novoPeriodo);
    // A atualização dos dados acontece via useEffect
  };

  // Função para atualizar relatórios manualmente
  const handleAtualizarRelatorios = () => {
    buscarDadosReais();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Central de Relatórios</h1>
          <p className="text-muted-foreground">Analise o desempenho e dados da sua usina solar.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <div className="flex gap-2 mb-1">
            <Button 
              variant={periodo === "3M" ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleChangePeriodo("3M")}
            >
              3M
            </Button>
            <Button 
              variant={periodo === "6M" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleChangePeriodo("6M")}
            >
              6M
            </Button>
            <Button 
              variant={periodo === "12M" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleChangePeriodo("12M")}
            >
              12M
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Label htmlFor="dataInicio" className="block text-sm mb-1">Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dataInicio"
                  variant={"outline"}
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !dataInicio && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dataInicio ? (
                    format(dataInicio, "dd/MM/yyyy")
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dataInicio}
                  onSelect={(date) => date && setDataInicio(date)}
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="dataFim" className="block text-sm mb-1">Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dataFim"
                  variant={"outline"}
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !dataFim && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dataFim ? (
                    format(dataFim, "dd/MM/yyyy")
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dataFim}
                  onSelect={(date) => date && setDataFim(date)}
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button 
          className="bg-green-600 hover:bg-green-700 ml-auto"
          onClick={handleAtualizarRelatorios}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Atualizar Relatórios
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="financeiro" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financeiro" className="flex items-center justify-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="operacional" className="flex items-center justify-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Operacional
          </TabsTrigger>
          <TabsTrigger value="geracao" className="flex items-center justify-center">
            <Zap className="h-4 w-4 mr-2" />
            Geração
          </TabsTrigger>
        </TabsList>
        <TabsContent value="financeiro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Receita de Faturas Pagas</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={receitaData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                      <Bar dataKey="valor" name="Receita (R$)" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Despesas</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={despesasData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Despesas']} />
                      <Line type="monotone" dataKey="valor" name="Despesas (R$)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="clientes">
          <div className="mt-4 bg-white rounded-lg border">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Desempenho de Clientes</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Lista de clientes cadastrados no sistema</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => sortClientes('nome')} className="cursor-pointer">
                        Nome
                        {sortConfig?.key === 'nome' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead onClick={() => sortClientes('consumoMedio')} className="cursor-pointer text-right">
                        Consumo Médio (kWh)
                        {sortConfig?.key === 'consumoMedio' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead onClick={() => sortClientes('economiaGerada')} className="cursor-pointer text-right">
                        Economia Gerada (R$)
                        {sortConfig?.key === 'economiaGerada' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead onClick={() => sortClientes('receitaTotal')} className="cursor-pointer text-right">
                        Receita Total (R$)
                        {sortConfig?.key === 'receitaTotal' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead onClick={() => sortClientes('faturasPendentes')} className="cursor-pointer text-right">
                        Faturas Pendentes
                        {sortConfig?.key === 'faturasPendentes' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead onClick={() => sortClientes('dataAdesao')} className="cursor-pointer">
                        Data de Adesão
                        {sortConfig?.key === 'dataAdesao' && (
                          sortConfig.direction === 'ascending' 
                            ? <ArrowUp className="inline h-4 w-4 ml-1" /> 
                            : <ArrowDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesAtuais.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell className="text-right">{cliente.consumoMedio}</TableCell>
                        <TableCell className="text-right">R$ {cliente.economiaGerada.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R$ {cliente.receitaTotal.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{cliente.faturasPendentes}</TableCell>
                        <TableCell>{cliente.dataAdesao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPaginas))}
                      className={currentPage === totalPaginas ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="operacional">
          <div className="p-6 mt-4 bg-white rounded-lg border">
            <div className="flex items-center justify-center h-[300px] flex-col">
              <BarChart2 className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Relatórios Operacionais</h3>
              <p className="text-gray-400">Esta seção está em desenvolvimento.</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                <BarChart2 className="h-4 w-4 mr-2" />
                Configurar Métricas
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="geracao">
          <div className="mt-4 space-y-8">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Geração de Energia Total (kWh)</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={geracaoData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kWh`, 'Geração']} />
                      <Bar dataKey="valor" name="Geração (kWh)" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Geração de Energia por Usina (kWh)</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={geracaoPorUsinaData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kWh`, 'Geração']} />
                      <Legend />
                      {geradoras.map((geradora, index) => (
                        <Bar 
                          key={geradora.id} 
                          dataKey={geradora.nome} 
                          name={geradora.nome} 
                          fill={index === 0 ? "#22c55e" : "#3b82f6"} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
