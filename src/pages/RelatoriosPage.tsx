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
  const [clientes, setClientes] = useState([
    { id: 1, nome: "Cliente A", usina: "Usina X", economia: 150.00 },
    { id: 2, nome: "Cliente B", usina: "Usina Y", economia: 220.50 },
    { id: 3, nome: "Cliente C", usina: "Usina Z", economia: 180.75 },
  ]);
  const [geradoras, setGeradoras] = useState([
    { id: 1, nome: "Usina X", capacidade: "500 kWp", producao: 12000 },
    { id: 2, nome: "Usina Y", capacidade: "750 kWp", producao: 18000 },
    { id: 3, nome: "Usina Z", capacidade: "1 MWp", producao: 25000 },
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Dashboards</h1>
          <p className="text-muted-foreground">Acompanhe os resultados da sua usina solar</p>
        </div>

        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecionar período</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                defaultMonth={date}
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > addDays(new Date(), 1)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geradoras.map((geradora) => (
                    <TableRow key={geradora.id}>
                      <TableCell className="font-medium">{geradora.nome}</TableCell>
                      <TableCell>{geradora.capacidade}</TableCell>
                      <TableCell className="text-right">
                        {geradora.producao.toLocaleString()} kWh
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lucro" className="space-y-4">
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
                    <Legend />
                    <Bar dataKey="receita" fill="#22c55e" name="Receita" />
                    <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
                    <Line 
                      type="monotone" 
                      dataKey="lucroLiquido" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Lucro Líquido"
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
