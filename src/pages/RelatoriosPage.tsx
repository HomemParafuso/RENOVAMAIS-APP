
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, DollarSign, Users, BarChart2, Zap, Calendar, CalendarRange } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState("6M");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [activeTab, setActiveTab] = useState("financeiro");

  // Dados para os gráficos - seriam atualizados com base no período selecionado
  const receitaData = [
    { mes: 'dez/24', valor: 12500 },
    { mes: 'jan/25', valor: 13200 },
    { mes: 'fev/25', valor: 14800 },
    { mes: 'mar/25', valor: 14200 },
    { mes: 'abr/25', valor: 15400 },
    { mes: 'mai/25', valor: 16300 },
  ];

  const economiaData = [
    { mes: 'dez/24', valor: 3200 },
    { mes: 'jan/25', valor: 3450 },
    { mes: 'fev/25', valor: 3800 },
    { mes: 'mar/25', valor: 3600 },
    { mes: 'abr/25', valor: 3900 },
    { mes: 'mai/25', valor: 4200 },
  ];

  const geracaoData = [
    { mes: 'dez/24', valor: 12500 },
    { mes: 'jan/25', valor: 13200 },
    { mes: 'fev/25', valor: 12800 },
    { mes: 'mar/25', valor: 14200 },
    { mes: 'abr/25', valor: 13800 },
    { mes: 'mai/25', valor: 15600 },
  ];

  const geracaoPorUsinaData = [
    { mes: 'dez/24', 'Usina Solar SP I': 7500, 'Usina Solar RJ II': 5000 },
    { mes: 'jan/25', 'Usina Solar SP I': 8000, 'Usina Solar RJ II': 5200 },
    { mes: 'fev/25', 'Usina Solar SP I': 7800, 'Usina Solar RJ II': 5000 },
    { mes: 'mar/25', 'Usina Solar SP I': 8500, 'Usina Solar RJ II': 5700 },
    { mes: 'abr/25', 'Usina Solar SP I': 8100, 'Usina Solar RJ II': 5700 },
    { mes: 'mai/25', 'Usina Solar SP I': 9200, 'Usina Solar RJ II': 6400 },
  ];

  // Função para mudar o período
  const handleChangePeriodo = (novoPeriodo: string) => {
    setPeriodo(novoPeriodo);
    // Aqui seria feita a chamada para atualizar os dados com base no período
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
                  onSelect={setDataInicio}
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
                  onSelect={setDataFim}
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button className="bg-green-600 hover:bg-green-700 ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Atualizar Relatórios
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={receitaData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" name="Receita (R$)" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Economia Gerada aos Clientes</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={economiaData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valor" name="Economia (R$)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="clientes">
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            Esta seção está em desenvolvimento.
          </div>
        </TabsContent>
        <TabsContent value="operacional">
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            Esta seção está em desenvolvimento.
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={geracaoData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" name="Geração (kWh)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={geracaoPorUsinaData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Usina Solar SP I" name="Usina Solar SP I" fill="#22c55e" />
                    <Bar dataKey="Usina Solar RJ II" name="Usina Solar RJ II" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
