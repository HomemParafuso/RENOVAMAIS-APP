
import React from "react";
import { BarChart3, Users, FileText, AlertTriangle, Download } from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, description, iconBgColor, iconColor = "text-white", change, trend }: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  iconBgColor: string;
  iconColor?: string;
  change?: string;
  trend?: "up" | "down";
}) => (
  <Card>
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
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Dados para o gráfico de pizza
  const economyData = [
    { name: "Economia", value: 100 }
  ];
  
  // Cores para o gráfico de pizza
  const COLORS = ["#22c55e", "#e4e4e7"];

  // Dados para o gráfico de barras
  const monthlyData = [
    { name: 'Dez', receita: 0 },
    { name: 'Jan', receita: 0 },
    { name: 'Fev', receita: 0 },
    { name: 'Mar', receita: 0 },
    { name: 'Abr', receita: 0 },
    { name: 'Mai', receita: 0 },
  ];

  // Top clientes
  const topClientes = [
    { id: 1, nome: 'Pablio Tacyanno', economia: 'Percentual de Economia', valor: 'R$ 0,00', faturas: '0 faturas' }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua usina solar</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Clientes Ativos" 
          value="1" 
          icon={Users} 
          description="de 1 clientes" 
          iconBgColor="bg-green-100" 
          iconColor="text-green-600" 
        />
        <StatCard 
          title="Faturas Pendentes" 
          value="1" 
          icon={FileText} 
          description="de 1 faturas" 
          iconBgColor="bg-yellow-100" 
          iconColor="text-yellow-600" 
        />
        <StatCard 
          title="Faturas Atrasadas" 
          value="0" 
          icon={AlertTriangle} 
          description="necessitam atenção" 
          iconBgColor="bg-red-100" 
          iconColor="text-red-600" 
        />
        <StatCard 
          title="Geração Total" 
          value="1.280 kWh" 
          icon={BarChart3} 
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-600" 
          change="12% este mês" 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Receita Mensal</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">3M</Button>
                <Button variant="outline" size="sm">6M</Button>
                <Button variant="outline" size="sm">12M</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
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
            <CardTitle>Tipos de Cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={economyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={false}
                  >
                    {economyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <p className="text-green-500 text-lg font-semibold">Economia 100%</p>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Percentual de Economia</span>
                </div>
              </div>
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
                <div key={cliente.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
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
  );
};

export default Dashboard;
