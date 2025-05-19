
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, DollarSign, Users, BarChart2 } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const RelatoriosPage = () => {
  // Dados para os gráficos
  const receitaData = [
    { mes: 'dez/24', valor: 0 },
    { mes: 'jan/25', valor: 0 },
    { mes: 'fev/25', valor: 0 },
    { mes: 'mar/25', valor: 0 },
    { mes: 'abr/25', valor: 0 },
    { mes: 'mai/25', valor: 0 },
  ];

  const economiaData = [
    { mes: 'dez/24', valor: 0 },
    { mes: 'jan/25', valor: 0 },
    { mes: 'fev/25', valor: 0 },
    { mes: 'mar/25', valor: 0 },
    { mes: 'abr/25', valor: 0 },
    { mes: 'mai/25', valor: 0 },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Central de Relatórios</h1>
          <p className="text-muted-foreground">Analise o desempenho e dados da sua usina solar.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <Select defaultValue="6meses">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3meses">Últimos 3 Meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 Meses</SelectItem>
              <SelectItem value="12meses">Últimos 12 Meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Atualizar Relatórios
        </Button>
      </div>

      <Tabs defaultValue="financeiro">
        <TabsList className="grid w-full grid-cols-3">
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
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
