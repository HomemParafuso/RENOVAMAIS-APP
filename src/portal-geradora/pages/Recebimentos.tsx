
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Recebimento {
  id: number;
  cliente: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pago' | 'pendente' | 'atrasado';
  formaPagamento?: string;
}

const mockRecebimentos: Recebimento[] = [
  {
    id: 1,
    cliente: "João Silva",
    valor: 350.00,
    dataVencimento: "2024-01-10",
    dataPagamento: "2024-01-09",
    status: "pago",
    formaPagamento: "PIX"
  },
  {
    id: 2,
    cliente: "Maria Santos",
    valor: 420.50,
    dataVencimento: "2024-01-15",
    status: "pendente"
  },
  {
    id: 3,
    cliente: "Pedro Costa",
    valor: 280.00,
    dataVencimento: "2024-01-05",
    status: "atrasado"
  }
];

export default function Recebimentos() {
  const [recebimentos] = useState<Recebimento[]>(mockRecebimentos);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const recebimentosFiltrados = recebimentos.filter(rec => 
    filtroStatus === "todos" || rec.status === filtroStatus
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPago = recebimentos
    .filter(r => r.status === 'pago')
    .reduce((sum, r) => sum + r.valor, 0);

  const totalPendente = recebimentos
    .filter(r => r.status !== 'pago')
    .reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recebimentos</h1>
          <p className="text-muted-foreground">Controle de pagamentos e recebimentos</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taxa de Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((recebimentos.filter(r => r.status === 'pago').length / recebimentos.length) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input placeholder="Buscar por cliente" className="pl-10" />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Valor</th>
                  <th className="text-left p-4">Vencimento</th>
                  <th className="text-left p-4">Pagamento</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Forma</th>
                  <th className="text-right p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {recebimentosFiltrados.map((recebimento) => (
                  <tr key={recebimento.id} className="border-b">
                    <td className="p-4 font-medium">{recebimento.cliente}</td>
                    <td className="p-4">R$ {recebimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">{new Date(recebimento.dataVencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      {recebimento.dataPagamento 
                        ? new Date(recebimento.dataPagamento).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(recebimento.status)}>
                        {recebimento.status}
                      </Badge>
                    </td>
                    <td className="p-4">{recebimento.formaPagamento || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {recebimento.status !== 'pago' && (
                          <Button variant="ghost" size="icon" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
