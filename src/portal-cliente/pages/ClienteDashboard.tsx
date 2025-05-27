
import React, { useState, useEffect } from "react";
import { BarChart3, FileText, TrendingDown, Zap, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  iconBgColor, 
  iconColor = "text-white",
  trend
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  iconBgColor: string;
  iconColor?: string;
  trend?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {trend && <p className="text-xs text-green-500 mt-2">{trend}</p>}
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ClienteDashboard = () => {
  const [dadosCliente, setDadosCliente] = useState({
    consumoMensal: "450 kWh",
    economiaMensal: "R$ 280,00",
    faturasPendentes: 1,
    proximoVencimento: "15/06/2025"
  });

  // Dados de consumo dos últimos 6 meses
  const dadosConsumo = [
    { mes: 'Jan', consumo: 420, economia: 250 },
    { mes: 'Fev', consumo: 380, economia: 280 },
    { mes: 'Mar', consumo: 450, economia: 320 },
    { mes: 'Abr', consumo: 410, economia: 290 },
    { mes: 'Mai', consumo: 430, economia: 310 },
    { mes: 'Jun', consumo: 450, economia: 280 },
  ];

  // Dados de distribuição de economia
  const distribuicaoEconomia = [
    { name: 'Economia Solar', value: 85, color: '#22c55e' },
    { name: 'Tarifa Convencional', value: 15, color: '#ef4444' }
  ];

  // Faturas recentes
  const faturasRecentes = [
    { id: 1, mes: 'Maio/2025', valor: 'R$ 170,00', status: 'Pendente', vencimento: '15/06/2025' },
    { id: 2, mes: 'Abril/2025', valor: 'R$ 160,00', status: 'Pago', vencimento: '15/05/2025' },
    { id: 3, mes: 'Março/2025', valor: 'R$ 180,00', status: 'Pago', vencimento: '15/04/2025' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Consumo Mensal" 
          value={dadosCliente.consumoMensal}
          icon={Zap} 
          description="mês atual"
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-600"
          trend="+5% vs mês anterior"
        />
        <StatCard 
          title="Economia Mensal" 
          value={dadosCliente.economiaMensal}
          icon={TrendingDown} 
          description="com energia solar"
          iconBgColor="bg-green-100" 
          iconColor="text-green-600"
          trend="+12% vs mês anterior"
        />
        <StatCard 
          title="Faturas Pendentes" 
          value={dadosCliente.faturasPendentes}
          icon={FileText} 
          description="aguardando pagamento"
          iconBgColor="bg-yellow-100" 
          iconColor="text-yellow-600"
        />
        <StatCard 
          title="Próximo Vencimento" 
          value={dadosCliente.proximoVencimento}
          icon={BarChart3} 
          description="fatura de maio"
          iconBgColor="bg-purple-100" 
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Consumo e Economia - Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosConsumo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumo" fill="#3b82f6" name="Consumo (kWh)" />
                  <Bar dataKey="economia" fill="#22c55e" name="Economia (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição da Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribuicaoEconomia}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {distribuicaoEconomia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {distribuicaoEconomia.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Faturas Recentes</CardTitle>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faturasRecentes.map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{fatura.mes}</h4>
                  <p className="text-sm text-gray-500">Vencimento: {fatura.vencimento}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fatura.valor}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    fatura.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {fatura.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteDashboard;
