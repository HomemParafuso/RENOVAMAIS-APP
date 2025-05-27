
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, Search, Filter } from "lucide-react";

const ClienteFaturas = () => {
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const faturas = [
    { 
      id: 1, 
      mes: 'Maio/2025', 
      valor: 'R$ 170,00', 
      status: 'Pendente', 
      vencimento: '15/06/2025',
      dataEmissao: '15/05/2025',
      consumo: '450 kWh',
      economia: 'R$ 280,00'
    },
    { 
      id: 2, 
      mes: 'Abril/2025', 
      valor: 'R$ 160,00', 
      status: 'Pago', 
      vencimento: '15/05/2025',
      dataEmissao: '15/04/2025',
      consumo: '410 kWh',
      economia: 'R$ 290,00'
    },
    { 
      id: 3, 
      mes: 'Março/2025', 
      valor: 'R$ 180,00', 
      status: 'Pago', 
      vencimento: '15/04/2025',
      dataEmissao: '15/03/2025',
      consumo: '450 kWh',
      economia: 'R$ 320,00'
    },
    { 
      id: 4, 
      mes: 'Fevereiro/2025', 
      valor: 'R$ 155,00', 
      status: 'Pago', 
      vencimento: '15/03/2025',
      dataEmissao: '15/02/2025',
      consumo: '380 kWh',
      economia: 'R$ 280,00'
    },
    { 
      id: 5, 
      mes: 'Janeiro/2025', 
      valor: 'R$ 165,00', 
      status: 'Pago', 
      vencimento: '15/02/2025',
      dataEmissao: '15/01/2025',
      consumo: '420 kWh',
      economia: 'R$ 250,00'
    },
  ];

  const faturasFiltradas = faturas.filter(fatura => {
    const matchMes = fatura.mes.toLowerCase().includes(filtroMes.toLowerCase());
    const matchStatus = filtroStatus === 'todas' || fatura.status.toLowerCase() === filtroStatus.toLowerCase();
    return matchMes && matchStatus;
  });

  const handleDownloadPDF = (fatura: any) => {
    // Simular download do PDF
    console.log(`Baixando PDF da fatura ${fatura.mes}`);
  };

  const handleVisualizarFatura = (fatura: any) => {
    // Abrir modal ou página de detalhes da fatura
    console.log(`Visualizando fatura ${fatura.mes}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Faturas</h1>
          <p className="text-muted-foreground">Histórico completo das suas faturas de energia solar</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar por mês</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Ex: Maio/2025" 
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select 
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="todas">Todas</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {faturasFiltradas.map((fatura) => (
          <Card key={fatura.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{fatura.mes}</h4>
                      <p className="text-sm text-gray-500">Emitida em {fatura.dataEmissao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="font-semibold text-lg">{fatura.valor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consumo</p>
                      <p className="font-medium">{fatura.consumo}</p>
                      <p className="text-sm text-green-600">Economia: {fatura.economia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="font-medium">{fatura.vencimento}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        fatura.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {fatura.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleVisualizarFatura(fatura)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadPDF(fatura)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {faturasFiltradas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fatura encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para encontrar suas faturas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClienteFaturas;
