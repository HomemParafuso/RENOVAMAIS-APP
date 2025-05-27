
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Zap, DollarSign } from "lucide-react";

const ClienteConsumo = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6M");

  const dadosConsumoDetalhado = [
    { mes: 'Jan', consumoReal: 420, consumoEstimado: 450, economia: 250, tarifaConvencional: 320 },
    { mes: 'Fev', consumoReal: 380, consumoEstimado: 400, economia: 280, tarifaConvencional: 350 },
    { mes: 'Mar', consumoReal: 450, consumoEstimado: 460, economia: 320, tarifaConvencional: 400 },
    { mes: 'Abr', consumoReal: 410, consumoEstimado: 430, economia: 290, tarifaConvencional: 370 },
    { mes: 'Mai', consumoReal: 430, consumoEstimado: 440, economia: 310, tarifaConvencional: 380 },
    { mes: 'Jun', consumoReal: 450, consumoEstimado: 460, economia: 280, tarifaConvencional: 390 },
  ];

  const economiaAnual = [
    { ano: '2023', economia: 2800, reducao: 15 },
    { ano: '2024', economia: 3200, reducao: 18 },
    { ano: '2025', economia: 3600, reducao: 22 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Consumo & Economia</h1>
          <p className="text-muted-foreground">Acompanhe seu desempenho energético e economia</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={periodoSelecionado === "3M" ? "default" : "outline"} 
            size="sm"
            onClick={() => setPeriodoSelecionado("3M")}
          >3M</Button>
          <Button 
            variant={periodoSelecionado === "6M" ? "default" : "outline"} 
            size="sm"
            onClick={() => setPeriodoSelecionado("6M")}
          >6M</Button>
          <Button 
            variant={periodoSelecionado === "12M" ? "default" : "outline"} 
            size="sm"
            onClick={() => setPeriodoSelecionado("12M")}
          >12M</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consumo Médio</p>
                <h3 className="text-2xl font-bold mt-1">425 kWh</h3>
                <p className="text-xs text-green-500 mt-2">-8% vs mês anterior</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economia Mensal</p>
                <h3 className="text-2xl font-bold mt-1">R$ 295</h3>
                <p className="text-xs text-green-500 mt-2">+12% vs mês anterior</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economia Anual</p>
                <h3 className="text-2xl font-bold mt-1">R$ 3.540</h3>
                <p className="text-xs text-green-500 mt-2">Projeção 2025</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Redução CO₂</p>
                <h3 className="text-2xl font-bold mt-1">1.2 ton</h3>
                <p className="text-xs text-green-500 mt-2">No ano</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Consumo Real vs Estimado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosConsumoDetalhado}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumoReal" fill="#3b82f6" name="Consumo Real (kWh)" />
                  <Bar dataKey="consumoEstimado" fill="#94a3b8" name="Consumo Estimado (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Economia vs Tarifa Convencional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosConsumoDetalhado}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="tarifaConvencional" stackId="1" stroke="#ef4444" fill="#ef4444" name="Tarifa Convencional (R$)" />
                  <Area dataKey="economia" stackId="1" stroke="#22c55e" fill="#22c55e" name="Com Solar (R$)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução da Economia Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={economiaAnual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis />
                <Tooltip />
                <Line dataKey="economia" stroke="#22c55e" strokeWidth={3} name="Economia Anual (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {economiaAnual.map((item) => (
              <div key={item.ano} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{item.ano}</p>
                <p className="text-lg font-bold text-green-600">R$ {item.economia.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{item.reducao}% redução</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteConsumo;
