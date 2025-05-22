
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Search, Filter, Download, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Definição da interface para despesas
interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  origem: string;
  recorrencia: string;
  status: string;
}

// Dados iniciais de exemplo
const despesasIniciais: Despesa[] = [
  {
    id: 1,
    descricao: "Manutenção de inversores",
    valor: 1200,
    data: "2025-05-10",
    categoria: "Manutenção",
    origem: "Usina Solar São Paulo I",
    recorrencia: "Mensal",
    status: "Pago"
  },
  {
    id: 2,
    descricao: "Limpeza dos painéis",
    valor: 800,
    data: "2025-05-15",
    categoria: "Limpeza",
    origem: "Usina Solar São Paulo I",
    recorrencia: "Trimestral",
    status: "Pendente"
  },
  {
    id: 3,
    descricao: "Seguro",
    valor: 2500,
    data: "2025-04-22",
    categoria: "Administrativo",
    origem: "Todas",
    recorrencia: "Anual",
    status: "Pago"
  }
];

const FinanceiroPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("despesas");
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  // Estados para o formulário de nova despesa
  const [novaDespesa, setNovaDespesa] = useState<Omit<Despesa, "id">>({
    descricao: "",
    valor: 0,
    data: format(new Date(), "yyyy-MM-dd"),
    categoria: "",
    origem: "",
    recorrencia: "Única",
    status: "Pendente"
  });
  
  const [dataSelector, setDataSelector] = useState<Date | undefined>(new Date());
  const [showForm, setShowForm] = useState(false);

  // Carrega despesas do localStorage ao iniciar
  useEffect(() => {
    const despesasSalvas = localStorage.getItem('despesas');
    if (despesasSalvas) {
      setDespesas(JSON.parse(despesasSalvas));
    } else {
      setDespesas(despesasIniciais);
      localStorage.setItem('despesas', JSON.stringify(despesasIniciais));
    }
  }, []);

  // Manipuladores de eventos para o formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovaDespesa(prev => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNovaDespesa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDataSelector(date);
      setNovaDespesa(prev => ({
        ...prev,
        data: format(date, "yyyy-MM-dd")
      }));
    }
  };

  const handleAdicionarDespesa = () => {
    if (!novaDespesa.descricao || novaDespesa.valor <= 0 || !novaDespesa.categoria || !novaDespesa.origem) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const novaDespesaCompleta = {
      id: despesas.length > 0 ? Math.max(...despesas.map(d => d.id)) + 1 : 1,
      ...novaDespesa
    };

    const novasDespesas = [...despesas, novaDespesaCompleta];
    setDespesas(novasDespesas);
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));

    // Resetar o formulário
    setNovaDespesa({
      descricao: "",
      valor: 0,
      data: format(new Date(), "yyyy-MM-dd"),
      categoria: "",
      origem: "",
      recorrencia: "Única",
      status: "Pendente"
    });
    setDataSelector(new Date());
    setShowForm(false);

    toast({
      title: "Despesa adicionada",
      description: "A despesa foi adicionada com sucesso",
    });
  };

  const handleExcluirDespesa = (id: number) => {
    const novasDespesas = despesas.filter(d => d.id !== id);
    setDespesas(novasDespesas);
    localStorage.setItem('despesas', JSON.stringify(novasDespesas));

    toast({
      title: "Despesa excluída",
      description: "A despesa foi excluída com sucesso",
    });
  };

  // Formatação de valores para exibição
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">Gerencie receitas e despesas do seu sistema</p>
        </div>
        {activeTab === "despesas" && !showForm && (
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>
        )}
      </div>

      <Tabs defaultValue="despesas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
        </TabsList>

        <TabsContent value="despesas">
          {showForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Nova Despesa</CardTitle>
                <CardDescription>Adicione uma nova despesa ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      name="descricao"
                      placeholder="Descrição da despesa"
                      value={novaDespesa.descricao}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      placeholder="0.00"
                      value={novaDespesa.valor || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="data"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataSelector && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataSelector ? (
                            format(dataSelector, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataSelector}
                          onSelect={handleDateSelect}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select onValueChange={(value) => handleSelectChange("categoria", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Impostos">Impostos</SelectItem>
                        <SelectItem value="Outras">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="origem">Origem</Label>
                    <Select onValueChange={(value) => handleSelectChange("origem", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Usina Solar São Paulo I">Usina Solar São Paulo I</SelectItem>
                        <SelectItem value="Todas">Todas as usinas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recorrencia">Recorrência</Label>
                    <Select 
                      defaultValue="Única" 
                      onValueChange={(value) => handleSelectChange("recorrencia", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de recorrência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Única">Única</SelectItem>
                        <SelectItem value="Diária">Diária</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                        <SelectItem value="Mensal">Mensal</SelectItem>
                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                        <SelectItem value="Anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      defaultValue="Pendente" 
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Pago">Pago</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAdicionarDespesa}>Salvar Despesa</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar despesas..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Recorrência</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {despesas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Nenhuma despesa registrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        despesas.map((despesa) => (
                          <TableRow key={despesa.id}>
                            <TableCell>{despesa.descricao}</TableCell>
                            <TableCell>{formatarValor(despesa.valor)}</TableCell>
                            <TableCell>{formatarData(despesa.data)}</TableCell>
                            <TableCell>{despesa.categoria}</TableCell>
                            <TableCell>{despesa.origem}</TableCell>
                            <TableCell>{despesa.recorrencia}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                despesa.status === "Pago" ? "bg-green-100 text-green-800" :
                                despesa.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              )}>
                                {despesa.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleExcluirDespesa(despesa.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="receitas">
          <div className="p-6 mt-4 bg-white rounded-lg border">
            <div className="flex items-center justify-center h-[300px] flex-col">
              <Download className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Gestão de Receitas</h3>
              <p className="text-gray-400">
                Esta seção está em desenvolvimento. As receitas são baseadas nos pagamentos 
                registrados no módulo de Faturas.
              </p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ir para Faturas
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroPage;
