import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MoreVertical, Edit, Trash2, Download, Plus, FileText, Calendar, BarChart2, DollarSign, RefreshCcw } from "lucide-react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

// Definição de tipos
interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  dataPagamento: string;
  dataVencimento: string;
  categoria: string;
  usina: string;
  recorrente: boolean;
  periodicidade?: "mensal" | "bimestral" | "trimestral" | "semestral" | "anual";
  status: "pago" | "pendente" | "atrasado";
}

interface Receita {
  id: number; // Id da fatura (recebimento)
  cliente: string;
  referencia: string; // Corresponde à fatura.referencia
  valor: string; // Corresponde à fatura.valor (manter como string para consistência com Fatura)
  dataPagamento?: string; // Data de pagamento (se houver)
  dataVencimento: string;
  status: "Pago" | "Pendente" | "Atrasado" | "Estornada"; // Alinhar com os status de Fatura
  notificado?: boolean; // Adicionar para compatibilidade com Fatura, se necessário
  // ... quaisquer outros campos relevantes da fatura que você queira exibir como receita
}

const categoriasDespesas = [
  "Manutenção",
  "Aluguel",
  "Impostos",
  "Funcionários",
  "Limpeza",
  "Segurança",
  "Marketing",
  "Administrativo",
  "Outros",
];

const despesasData: Despesa[] = [
  {
    id: 1,
    descricao: "Manutenção dos painéis solares",
    valor: 850.00,
    dataPagamento: "15/05/2025",
    dataVencimento: "15/05/2025",
    categoria: "Manutenção",
    usina: "Usina Solar São Paulo I",
    recorrente: true,
    periodicidade: "trimestral",
    status: "pago",
  },
  {
    id: 2,
    descricao: "Seguro equipamentos",
    valor: 1250.00,
    dataPagamento: "",
    dataVencimento: "20/05/2025",
    categoria: "Segurança",
    usina: "Usina Solar São Paulo I",
    recorrente: true,
    periodicidade: "mensal",
    status: "pendente",
  },
  {
    id: 3,
    descricao: "Limpeza painéis",
    valor: 350.00,
    dataPagamento: "",
    dataVencimento: "02/05/2025",
    categoria: "Limpeza",
    usina: "Usina Solar São Paulo I",
    recorrente: true,
    periodicidade: "mensal",
    status: "atrasado",
  },
];

const despesaSchema = z.object({
  descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  dataVencimento: z.date(),
  dataPagamento: z.date().optional(),
  categoria: z.string().min(1, "Selecione uma categoria"),
  usina: z.string().min(1, "Selecione uma usina"),
  recorrente: z.boolean().default(false),
  periodicidade: z.enum(["mensal", "bimestral", "trimestral", "semestral", "anual"]).optional(),
  status: z.enum(["pago", "pendente", "atrasado"]).default("pendente"),
});

const FinanceiroPage = () => {
  const [tabAtiva, setTabAtiva] = useState<"despesas" | "receitas" | "resumo">("resumo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [despesas, setDespesas] = useState<Despesa[]>(despesasData);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [usinas, setUsinas] = useState<any[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();

  // New states for estorno de recebimento
  const [isEstornarRecebimentoModalOpen, setIsEstornarRecebimentoModalOpen] = useState(false);
  const [receitaAtual, setReceitaAtual] = useState<Receita | undefined>(undefined);

  // Formulário para nova despesa
  const form = useForm<z.infer<typeof despesaSchema>>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: "",
      valor: 0,
      dataVencimento: new Date(),
      categoria: "",
      usina: "",
      recorrente: false,
      status: "pendente",
    },
  });

  // Buscar usinas cadastradas
  useEffect(() => {
    try {
      // Carregar receitas (faturas pagas) do localStorage
      const faturasArmazenadas = localStorage.getItem('faturas');
      if (faturasArmazenadas) {
        const todasFaturas: Receita[] = JSON.parse(faturasArmazenadas);
        // Filtra apenas as faturas com status 'Pago' para serem consideradas receitas
        const faturasPagas = todasFaturas.filter(fatura => fatura.status === "Pago");
        setReceitas(faturasPagas);
      }

      // Carregar usinas cadastradas
      const geradorasArmazenadas = localStorage.getItem('geradoras');
      if (geradorasArmazenadas) {
        setUsinas(JSON.parse(geradorasArmazenadas));
      } else {
        // Dados de exemplo se não houver nada no localStorage
        setUsinas([{
          id: 1,
          nome: "Usina Solar São Paulo I",
          potencia: "500 kWp",
          localizacao: "São Paulo, SP",
        }]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações financeiras. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, []);

  // Filtrar despesas
  const filtrarDespesas = () => {
    let despesasFiltradas = [...despesas];
    
    if (filtroCategoria !== "todas") {
      despesasFiltradas = despesasFiltradas.filter(d => d.categoria === filtroCategoria);
    }
    
    if (filtroStatus !== "todos") {
      despesasFiltradas = despesasFiltradas.filter(d => d.status === filtroStatus);
    }
    
    return despesasFiltradas;
  };

  const despesasFiltradas = filtrarDespesas();
  const totalPages = Math.ceil(despesasFiltradas.length / itemsPerPage);
  const currentItems = despesasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total de despesas e receitas
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
  const totalReceitas = receitas.reduce((sum, r) => sum + parseFloat(r.valor), 0);
  
  // Despesas por categoria para mostrar no card
  const despesasPorCategoria: Record<string, number> = {};
  despesas.forEach(d => {
    if (!despesasPorCategoria[d.categoria]) {
      despesasPorCategoria[d.categoria] = 0;
    }
    despesasPorCategoria[d.categoria] += d.valor;
  });
  
  // Pegar a maior categoria de despesa
  const maiorCategoria = Object.entries(despesasPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1);

  // Calcular receita líquida
  const calcularReceitaLiquida = () => {
    const receitasMap = new Map();
    const despesasMap = new Map();
    
    // Mapear receitas por mês
    receitas.forEach(r => {
      if (r.status === "Pago" && r.dataPagamento) {
        const mes = r.dataPagamento.substring(3); // MM/YYYY
        receitasMap.set(mes, (receitasMap.get(mes) || 0) + parseFloat(r.valor));
      }
    });
    
    // Mapear despesas por mês
    despesas.forEach(d => {
      if (d.status === "pago" && d.dataPagamento) {
        const mes = d.dataPagamento.substring(3); // MM/YYYY
        despesasMap.set(mes, (despesasMap.get(mes) || 0) + d.valor);
      }
    });
    
    // Combinar dados
    const meses = Array.from(new Set([...receitasMap.keys(), ...despesasMap.keys()])).sort();
    
    return meses.map(mes => ({
      mes,
      receita: receitasMap.get(mes) || 0,
      despesa: despesasMap.get(mes) || 0,
      liquida: (receitasMap.get(mes) || 0) - (despesasMap.get(mes) || 0)
    }));
  };

  const dadosReceitaLiquida = calcularReceitaLiquida();

  // Adicionar nova despesa
  const onSubmit = (data: z.infer<typeof despesaSchema>) => {
    const novaDespesa: Despesa = {
      id: despesas.length + 1,
      descricao: data.descricao,
      valor: data.valor,
      dataVencimento: format(data.dataVencimento, "dd/MM/yyyy"),
      dataPagamento: data.dataPagamento ? format(data.dataPagamento, "dd/MM/yyyy") : "",
      categoria: data.categoria,
      usina: data.usina,
      recorrente: data.recorrente,
      periodicidade: data.recorrente ? data.periodicidade : undefined,
      status: data.status,
    };
    
    setDespesas([...despesas, novaDespesa]);
    setIsModalOpen(false);
    form.reset();
    
    toast({
      title: "Despesa cadastrada",
      description: `A despesa "${data.descricao}" foi cadastrada com sucesso.`,
    });
  };

  // Excluir despesa
  const handleExcluirDespesa = (id: number) => {
    setDespesas(despesas.filter(d => d.id !== id));
    toast({
      title: "Despesa excluída",
      description: "A despesa foi removida com sucesso.",
    });
  };

  // Editar despesa
  const handleEditarDespesa = (despesa: Despesa) => {
    // Em um cenário real, abriríamos um modal com os dados preenchidos
    toast({
      title: "Editar despesa",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  // Marcar como paga
  const handleMarcarComoPago = (id: number) => {
    setDespesas(despesas.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: "pago" as const,
          dataPagamento: format(new Date(), "dd/MM/yyyy")
        };
      }
      return d;
    }));
    
    toast({
      title: "Despesa atualizada",
      description: "Despesa marcada como paga.",
    });
  };

  // Função para lidar com o estorno de recebimento
  const handleEstornarRecebimento = (receita: Receita) => {
    setReceitaAtual(receita);
    setIsEstornarRecebimentoModalOpen(true);
  };

  // Função para confirmar o estorno de recebimento
  const confirmarEstornoRecebimento = () => {
    if (!receitaAtual) return;

    // Obter todas as faturas do localStorage (elas representam os recebimentos)
    const faturasArmazenadas = localStorage.getItem('faturas');
    let todasFaturas: Receita[] = faturasArmazenadas ? JSON.parse(faturasArmazenadas) : [];

    // Atualizar o status da fatura específica para "Estornada"
    const faturasAtualizadas = todasFaturas.map(fatura =>
      fatura.id === receitaAtual.id
        ? { ...fatura, status: "Estornada" }
        : fatura
    );

    // Salvar as faturas atualizadas de volta no localStorage
    localStorage.setItem('faturas', JSON.stringify(faturasAtualizadas));

    // Atualizar o estado 'receitas' em FinanceiroPage re-filtrando as faturas pagas
    const novasReceitas = faturasAtualizadas.filter(fatura => fatura.status === "Pago");
    setReceitas(novasReceitas);

    toast({
      title: "Pagamento estornado",
      description: `O pagamento da fatura ${receitaAtual.referencia} foi estornado com sucesso.`,
    });

    setIsEstornarRecebimentoModalOpen(false);
    setReceitaAtual(undefined);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Gerencie receitas e despesas da sua usina solar</p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">R$ {totalReceitas.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {receitas.filter(r => r.status === "Pago").length} faturas pagas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">R$ {totalDespesas.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {despesas.filter(d => d.status === "pendente").length} despesas pendentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maior categoria de despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{maiorCategoria[0]?.[0] || "N/A"}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {maiorCategoria[0] ? `R$ ${maiorCategoria[0][1].toFixed(2)}` : "Sem despesas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setTabAtiva("resumo")}
          className={`px-4 py-2 font-medium ${
            tabAtiva === "resumo" 
              ? "border-b-2 border-green-600 text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Resumo Financeiro
        </button>
        <button
          onClick={() => setTabAtiva("despesas")}
          className={`px-4 py-2 font-medium ${
            tabAtiva === "despesas" 
              ? "border-b-2 border-green-600 text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Despesas
        </button>
        <button
          onClick={() => setTabAtiva("receitas")}
          className={`px-4 py-2 font-medium ${
            tabAtiva === "receitas" 
              ? "border-b-2 border-green-600 text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Receitas
        </button>
      </div>

      {/* Conteúdo da tab ativa */}
      {tabAtiva === "resumo" ? (
        <div className="grid grid-cols-1 gap-8">
          {/* Gráfico de Receita Líquida */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Receita Líquida (Receitas - Despesas)</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dadosReceitaLiquida}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`R$ ${value}`, name]} />
                  <Legend />
                  <Bar dataKey="receita" name="Receitas" fill="#22c55e" />
                  <Bar dataKey="despesa" name="Despesas" fill="#ef4444" />
                  <Line type="monotone" dataKey="liquida" name="Receita Líquida" stroke="#3b82f6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Resumo dos últimos meses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Receitas do Mês</h4>
              <p className="text-2xl font-bold text-green-600">
                R$ {receitas.filter(r => r.status === "Pago").reduce((sum, r) => sum + parseFloat(r.valor), 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Despesas do Mês</h4>
              <p className="text-2xl font-bold text-red-600">
                R$ {despesas.filter(d => d.status === "pago").reduce((sum, d) => sum + d.valor, 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Líquido do Mês</h4>
              <p className="text-2xl font-bold text-blue-600">
                R$ {(receitas.filter(r => r.status === "Pago").reduce((sum, r) => sum + parseFloat(r.valor), 0) - 
                     despesas.filter(d => d.status === "pago").reduce((sum, d) => sum + d.valor, 0)).toFixed(2)}
              </p>
            </Card>
          </div>
        </div>
      ) : tabAtiva === "despesas" ? (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar despesas"
                  className="pl-10 min-w-[200px]"
                />
              </div>
              
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categoriasDespesas.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Nova Despesa</DialogTitle>
                  <DialogDescription>
                    Cadastre uma nova despesa para sua usina solar.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="valor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categoriasDespesas.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dataVencimento"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Vencimento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="usina"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usina</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma usina" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {usinas.map((u) => (
                                  <SelectItem key={u.id} value={u.nome}>{u.nome}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="recorrente"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 mt-1 accent-green-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Despesa recorrente</FormLabel>
                            <FormDescription>
                              Esta despesa se repete regularmente
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("recorrente") && (
                      <FormField
                        control={form.control}
                        name="periodicidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Periodicidade</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a periodicidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="bimestral">Bimestral</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-md border">
            <Table>
              <TableCaption>Lista de despesas</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Usina</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma despesa encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((despesa) => (
                    <TableRow key={despesa.id}>
                      <TableCell className="font-medium">{despesa.descricao}</TableCell>
                      <TableCell>{despesa.categoria}</TableCell>
                      <TableCell>{despesa.usina}</TableCell>
                      <TableCell>{despesa.dataVencimento}</TableCell>
                      <TableCell className="text-right">R$ {despesa.valor.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${despesa.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                          ${despesa.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${despesa.status === 'atrasado' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {despesa.status === 'pago' && 'Pago'}
                          {despesa.status === 'pendente' && 'Pendente'}
                          {despesa.status === 'atrasado' && 'Atrasado'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {despesa.status !== 'pago' && (
                              <DropdownMenuItem onClick={() => handleMarcarComoPago(despesa.id)}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Marcar como pago
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEditarDespesa(despesa)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExcluirDespesa(despesa.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Mostrar primeiro, último, atual e páginas próximas
                        return page === 1 || page === totalPages || 
                          Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, i, arr) => {
                        // Adicionar elipses se houver saltos
                        if (i > 0 && page - arr[i-1] > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink 
                                  isActive={currentPage === page}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar receitas"
                  className="pl-10 min-w-[200px]"
                />
              </div>
              
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="todos-clientes">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos-clientes">Todos os clientes</SelectItem>
                  <SelectItem value="pablio">Pablio Tacyanno</SelectItem>
                  <SelectItem value="maria">Maria Empreendimentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-md border">
            <Table>
              <TableCaption>Lista de receitas</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id}>
                    <TableCell className="font-medium">{receita.cliente}</TableCell>
                    <TableCell>{receita.descricao}</TableCell>
                    <TableCell>{receita.referencia}</TableCell>
                    <TableCell>{receita.dataVencimento}</TableCell>
                    <TableCell>{receita.dataPagamento || "-"}</TableCell>
                    <TableCell className="text-right">R$ {receita.valor}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${receita.status === 'Pago' ? 'bg-green-100 text-green-800' : ''}
                        ${receita.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${receita.status === 'Atrasado' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {receita.status === 'Pago' && 'Pago'}
                        {receita.status === 'Pendente' && 'Pendente'}
                        {receita.status === 'Atrasado' && 'Atrasado'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {receita.status === 'Pago' && (
                            <DropdownMenuItem 
                              onClick={() => handleEstornarRecebimento(receita)}
                              className="text-orange-600 hover:text-orange-700 focus:text-orange-700"
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Estornar Pagamento
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Modal de confirmação de estorno de recebimento */}
      <Dialog open={isEstornarRecebimentoModalOpen} onOpenChange={setIsEstornarRecebimentoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar estorno de recebimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estornar este recebimento? Esta ação alterará o balanço financeiro da empresa e a devolução ao cliente deverá ser processada manualmente pelo sistema bancário.
            </DialogDescription>
          </DialogHeader>
          
          {receitaAtual && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-sm">{receitaAtual.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-sm">{receitaAtual.referencia}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-sm">{receitaAtual.dataVencimento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-sm">{receitaAtual.valor}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEstornarRecebimentoModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEstornoRecebimento}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Estornar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceiroPage;
