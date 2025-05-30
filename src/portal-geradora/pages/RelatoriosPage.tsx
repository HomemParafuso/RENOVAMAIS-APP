
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { addDays, format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts';

const RelatoriosPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [periodo, setPeriodo] = useState("mensal");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6M");
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();
  const [clientes, setClientes] = useState([
    { id: 1, nome: "Cliente A", usina: "Usina X", economia: 150.00 },
    { id: 2, nome: "Cliente B", usina: "Usina Y", economia: 220.50 },
    { id: 3, nome: "Cliente C", usina: "Usina Z", economia: 180.75 },
  ]);
  const [geradoras, setGeradoras] = useState([
    { id: 1, nome: "Usina X", capacidade: "500 kWp", producao: 12000, consumo: 10500 },
    { id: 2, nome: "Usina Y", capacidade: "750 kWp", producao: 18000, consumo: 15200 },
    { id: 3, nome: "Usina Z", capacidade: "1 MWp", producao: 25000, consumo: 22800 },
  ]);

  const calcularDadosClientesPorPeriodo = () => {
    return clientes.map((cliente) => ({
      ...cliente,
      economiaNoPeriodo: cliente.economia * 1.1,
    }));
  };

  // Calculate clients with period data
  const clientesComDadosPeriodo = calcularDadosClientesPorPeriodo();

  // Dados para gráfico de lucro líquido
  const dadosLucroLiquido = [
    { mes: 'Jan', receita: 28000, despesa: 18000, lucroLiquido: 10000 },
    { mes: 'Fev', receita: 32000, despesa: 19000, lucroLiquido: 13000 },
    { mes: 'Mar', receita: 30000, despesa: 20000, lucroLiquido: 10000 },
    { mes: 'Abr', receita: 35000, despesa: 22000, lucroLiquido: 13000 },
    { mes: 'Mai', receita: 38000, despesa: 23000, lucroLiquido: 15000 },
    { mes: 'Jun', receita: 42000, despesa: 25000, lucroLiquido: 17000 },
  ];

  // Dados para produção vs consumo por mês
  const dadosProducaoConsumo = [
    { mes: 'Jan', producao: 55000, consumo: 48500, saldo: 6500 },
    { mes: 'Fev', producao: 58000, consumo: 50200, saldo: 7800 },
    { mes: 'Mar', producao: 60000, consumo: 52800, saldo: 7200 },
    { mes: 'Abr', producao: 62000, consumo: 54100, saldo: 7900 },
    { mes: 'Mai', producao: 65000, consumo: 55600, saldo: 9400 },
    { mes: 'Jun', producao: 68000, consumo: 57200, saldo: 10800 },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Dashboards</h1>
          <p className="text-muted-foreground">Acompanhe os resultados da sua usina solar</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Data atual apenas visual */}
          <div className="flex items-center px-4 py-2 border border-gray-200 rounded-md bg-gray-50">
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>

          <Input
            type="search"
            placeholder="Filtrar resultados..."
            className="max-w-md"
          />
        </div>
      </div>

      <Tabs defaultValue="clientes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="geradoras">Geradoras</TabsTrigger>
          <TabsTrigger value="lucro">Lucro Líquido</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Economia por Cliente</CardTitle>
              <CardDescription>
                Acompanhe a economia gerada para cada cliente no período.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Usina</TableHead>
                    <TableHead className="text-right">Economia (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesComDadosPeriodo.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell>{cliente.usina}</TableCell>
                      <TableCell className="text-right">
                        R$ {cliente.economiaNoPeriodo.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geradoras" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produção por Geradora</CardTitle>
                <CardDescription>
                  Visualize a produção de energia por usina geradora.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usina</TableHead>
                      <TableHead>Capacidade</TableHead>
                      <TableHead className="text-right">Produção (kWh)</TableHead>
                      <TableHead className="text-right">Consumo (kWh)</TableHead>
                      <TableHead className="text-right">Saldo (kWh)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geradoras.map((geradora) => {
                      const saldo = geradora.producao - geradora.consumo;
                      return (
                        <TableRow key={geradora.id}>
                          <TableCell className="font-medium">{geradora.nome}</TableCell>
                          <TableCell>{geradora.capacidade}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {geradora.producao.toLocaleString()} kWh
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {geradora.consumo.toLocaleString()} kWh
                          </TableCell>
                          <TableCell className={`text-right font-bold ${saldo > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {saldo > 0 ? '+' : ''}{saldo.toLocaleString()} kWh
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produção vs Consumo Mensal</CardTitle>
                <CardDescription>Evolução do saldo energético ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={dadosProducaoConsumo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${Number(value).toLocaleString('pt-BR')} kWh`,
                        name === 'producao' ? 'Produção' : 
                        name === 'consumo' ? 'Consumo' : 'Saldo'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="producao" fill="#22c55e" name="Produção" />
                    <Bar dataKey="consumo" fill="#ef4444" name="Consumo" />
                    <Line 
                      type="monotone" 
                      dataKey="saldo" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Saldo"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Energético</CardTitle>
              <CardDescription>Análise consolidada de produção vs consumo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Produção Total</div>
                  <div className="text-2xl font-bold text-green-700">
                    {dadosProducaoConsumo.reduce((acc, item) => acc + item.producao, 0).toLocaleString()} kWh
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600">Consumo Total</div>
                  <div className="text-2xl font-bold text-red-700">
                    {dadosProducaoConsumo.reduce((acc, item) => acc + item.consumo, 0).toLocaleString()} kWh
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Saldo Total</div>
                  <div className="text-2xl font-bold text-blue-700">
                    +{dadosProducaoConsumo.reduce((acc, item) => acc + item.saldo, 0).toLocaleString()} kWh
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Eficiência</div>
                  <div className="text-2xl font-bold text-gray-700">
                    {(((dadosProducaoConsumo.reduce((acc, item) => acc + item.producao, 0) - dadosProducaoConsumo.reduce((acc, item) => acc + item.consumo, 0)) / dadosProducaoConsumo.reduce((acc, item) => acc + item.producao, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lucro" className="space-y-4">
          {/* Controles de Período */}
          <Card>
            <CardHeader>
              <CardTitle>Período de Análise</CardTitle>
              <CardDescription>Selecione o período para análise do lucro líquido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  {['3M', '6M', '12M'].map((p) => (
                    <Button
                      key={p}
                      variant={periodoSelecionado === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPeriodoSelecionado(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">De:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dataInicio && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicio ? format(dataInicio, "dd/MM/yy") : "Início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Até:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dataFim && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFim ? format(dataFim, "dd/MM/yy") : "Fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Resumo do Lucro */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Resumo do Lucro Líquido</CardTitle>
                <CardDescription>Análise de receitas vs despesas no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-600">Receita Total</span>
                    <span className="text-lg font-bold text-green-700">R$ 205.000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-600">Despesas Totais</span>
                    <span className="text-lg font-bold text-red-700">R$ 127.000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <span className="text-sm text-blue-600">Lucro Líquido</span>
                    <span className="text-xl font-bold text-blue-700">R$ 78.000</span>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Margem de lucro: 38.0%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Lucro Líquido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Evolução do Lucro Líquido</CardTitle>
                <CardDescription>Comparativo mensal de receitas, despesas e lucro</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={dadosLucroLiquido}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString('pt-BR')}`,
                        name === 'receita' ? 'Receita' : 
                        name === 'despesa' ? 'Despesa' : 'Lucro Líquido'
                      ]}
                    />
                    <Legend 
                      formatter={(value) => 
                        value === 'receita' ? 'Receita' : 
                        value === 'despesa' ? 'Despesa' : 'Lucro Líquido'
                      }
                    />
                    <Bar dataKey="receita" fill="#22c55e" name="receita" />
                    <Bar dataKey="despesa" fill="#ef4444" name="despesa" />
                    <Line 
                      type="monotone" 
                      dataKey="lucroLiquido" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="lucroLiquido"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Detalhada de Lucro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Detalhamento por Mês</CardTitle>
              <CardDescription>Análise detalhada do lucro líquido mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">Despesas</TableHead>
                    <TableHead className="text-right">Lucro Líquido</TableHead>
                    <TableHead className="text-right">Margem (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosLucroLiquido.map((item) => (
                    <TableRow key={item.mes}>
                      <TableCell className="font-medium">{item.mes}</TableCell>
                      <TableCell className="text-right text-green-600">
                        R$ {item.receita.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        R$ {item.despesa.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 font-bold">
                        R$ {item.lucroLiquido.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        {((item.lucroLiquido / item.receita) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
