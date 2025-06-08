import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, CheckCircle, MoreVertical, RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DetalheFaturaModal from "@/components/fatura/DetalheFaturaModal";

interface Recebimento {
  id: number;
  cliente: string;
  valor: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Estornada';
  formaPagamento?: string;
  referencia?: string;
  notificado?: boolean;
}

const parseCurrencyToFloat = (currencyString: string | undefined): number => {
  if (!currencyString) return 0;
  // Remove "R$", replace comma with dot, then parse
  const cleanedString = currencyString.replace('R$', '').replace('.', '').replace(',', '.').trim();
  return parseFloat(cleanedString) || 0;
};

export default function Recebimentos() {
  const { toast } = useToast();
  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [isEstornarRecebimentoModalOpen, setIsEstornarRecebimentoModalOpen] = useState(false);
  const [recebimentoAtual, setRecebimentoAtual] = useState<Recebimento | undefined>(undefined);
  const [isDetalhesRecebimentoModalOpen, setIsDetalhesRecebimentoModalOpen] = useState(false);

  React.useEffect(() => {
    const faturasArmazenadas = localStorage.getItem('faturas');
    if (faturasArmazenadas) {
      try {
        const todasFaturas: Recebimento[] = JSON.parse(faturasArmazenadas);
        setRecebimentos(todasFaturas);
      } catch (error) {
        console.error("Erro ao parsear faturas do localStorage:", error);
        toast({
          title: "Erro de dados",
          description: "Não foi possível carregar as faturas. Os dados armazenados podem estar corrompidos.",
          variant: "destructive"
        });
        setRecebimentos([]); // Garante que o estado não fica com dados inválidos
      }
    }
  }, []);

  const recebimentosFiltrados = recebimentos.filter(rec => 
    filtroStatus === "todos" 
      ? true // Mostrar todas as faturas quando o filtro é "todos"
      : rec.status === filtroStatus
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pago': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      case 'Estornada': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPago = recebimentos
    .filter(r => r.status === 'Pago')
    .reduce((sum, r) => sum + parseCurrencyToFloat(r.valor), 0);

  const totalPendente = recebimentos
    .filter(r => r.status !== 'Pago' && r.status !== 'Estornada')
    .reduce((sum, r) => sum + parseCurrencyToFloat(r.valor), 0);

  const handleEstornarRecebimento = (recebimento: Recebimento) => {
    setRecebimentoAtual(recebimento);
    setIsEstornarRecebimentoModalOpen(true);
  };

  const handleVerDetalhesRecebimento = (recebimento: Recebimento) => {
    setRecebimentoAtual(recebimento);
    setIsDetalhesRecebimentoModalOpen(true);
  };

  const confirmarEstornoRecebimento = () => {
    if (!recebimentoAtual) return;

    const faturasArmazenadas = localStorage.getItem('faturas');
    let todasFaturas: Recebimento[] = faturasArmazenadas ? JSON.parse(faturasArmazenadas) : [];

    const faturasAtualizadas = todasFaturas.map(fatura =>
      fatura.id === recebimentoAtual.id
        ? { ...fatura, status: "Estornada" }
        : fatura
    );

    localStorage.setItem('faturas', JSON.stringify(faturasAtualizadas));

    const novasRecebimentos = faturasAtualizadas.filter(fatura => fatura.status === "Pago");
    setRecebimentos(novasRecebimentos);

    toast({
      title: "Pagamento estornado",
      description: `O pagamento do recebimento de ${recebimentoAtual.cliente} (Ref: ${recebimentoAtual.referencia || 'N/A'}) foi estornado com sucesso.`,
    });

    setIsEstornarRecebimentoModalOpen(false);
    setRecebimentoAtual(undefined);
  };

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
              {((recebimentos.filter(r => r.status === 'Pago').length / (recebimentos.length > 0 ? recebimentos.length : 1)) * 100).toFixed(1)}%
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
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Atrasado">Atrasado</SelectItem>
            <SelectItem value="Estornada">Estornada</SelectItem>
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
                    <td className="p-4">R$ {parseCurrencyToFloat(recebimento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerDetalhesRecebimento(recebimento)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {recebimento.status === 'Pago' && (
                            <DropdownMenuItem 
                              onClick={() => handleEstornarRecebimento(recebimento)}
                              className="text-orange-600 hover:text-orange-700 focus:text-orange-700"
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Estornar Pagamento
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEstornarRecebimentoModalOpen} onOpenChange={setIsEstornarRecebimentoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar estorno de recebimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estornar este recebimento? Esta ação alterará o balanço financeiro da empresa e a devolução ao cliente deverá ser processada manualmente pelo sistema bancário.
            </DialogDescription>
          </DialogHeader>
          
          {recebimentoAtual && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-sm">{recebimentoAtual.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-sm">{recebimentoAtual.referencia || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-sm">{new Date(recebimentoAtual.dataVencimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-sm">R$ {parseCurrencyToFloat(recebimentoAtual.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEstornarRecebimentoModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEstornoRecebimento}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Estornar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {recebimentoAtual && (
        <DetalheFaturaModal
          isOpen={isDetalhesRecebimentoModalOpen}
          onClose={() => setIsDetalhesRecebimentoModalOpen(false)}
          fatura={recebimentoAtual}
        />
      )}
    </div>
  );
}
