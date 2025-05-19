
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, MoreVertical, Eye, Edit, Bell, Download, QrCode, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NovaFaturaModal from "@/components/fatura/NovaFaturaModal";
import DetalheFaturaModal from "@/components/fatura/DetalheFaturaModal";
import { useToast } from "@/components/ui/use-toast";

interface Fatura {
  id: number;
  cliente: string;
  referencia: string;
  vencimento: string;
  valor: string;
  status: string;
  notificado: boolean;
}

const FaturasPage = () => {
  const [isNovaFaturaModalOpen, setIsNovaFaturaModalOpen] = useState(false);
  const [isDetalhesFaturaModalOpen, setIsDetalhesFaturaModalOpen] = useState(false);
  const [faturaAtual, setFaturaAtual] = useState<Fatura | undefined>(undefined);
  const { toast } = useToast();

  const faturas: Fatura[] = [
    {
      id: 1,
      cliente: "Pablio Tacyanno",
      referencia: "05/2025",
      vencimento: "10/05/2025",
      valor: "R$ 150,00",
      status: "Pendente",
      notificado: false
    }
  ];

  const handleVerDetalhes = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsDetalhesFaturaModalOpen(true);
  };

  const handleNotificarCliente = (fatura: Fatura) => {
    toast({
      title: "Cliente notificado",
      description: `Notificação enviada para ${fatura.cliente} sobre a fatura de ${fatura.referencia}.`,
    });
  };

  const handleDownloadFatura = (fatura: Fatura) => {
    toast({
      title: "Download iniciado",
      description: `Download da fatura de ${fatura.referencia} iniciado.`,
    });
  };

  const handleGerarQRCode = (fatura: Fatura) => {
    toast({
      title: "QR Code gerado",
      description: `QR Code gerado para a fatura de ${fatura.referencia}.`,
    });
  };

  const handleCompartilharFatura = (fatura: Fatura) => {
    toast({
      title: "Link de compartilhamento gerado",
      description: `A fatura de ${fatura.referencia} está pronta para ser compartilhada.`,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Faturas</h1>
          <p className="text-muted-foreground">Gerencie todas as faturas da sua usina solar</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsNovaFaturaModalOpen(true)}>
          <span className="mr-2">+</span>
          Nova Fatura
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por cliente ou referência"
            className="pl-10"
          />
        </div>
        <Select defaultValue="todos-status">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos-status">Todos os Status</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="todos-clientes">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos-clientes">Todos os Clientes</SelectItem>
            <SelectItem value="pablio">Pablio Tacyanno</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-7 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Cliente</div>
          <div>Referência</div>
          <div>Vencimento</div>
          <div>Valor</div>
          <div>Status</div>
          <div>Notificado</div>
          <div className="text-right">Ações</div>
        </div>
        
        {faturas.map((fatura) => (
          <div key={fatura.id} className="grid grid-cols-7 px-6 py-4 border-b last:border-0 items-center">
            <div>{fatura.cliente}</div>
            <div>{fatura.referencia || '-'}</div>
            <div>{fatura.vencimento}</div>
            <div>{fatura.valor}</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {fatura.status}
              </span>
            </div>
            <div className="text-red-500">
              {fatura.notificado ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span>✕</span>
              )}
            </div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleVerDetalhes(fatura)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNotificarCliente(fatura)}>
                    <Bell className="h-4 w-4 mr-2" />
                    Notificar Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadFatura(fatura)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Fatura
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleGerarQRCode(fatura)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCompartilharFatura(fatura)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <NovaFaturaModal 
        isOpen={isNovaFaturaModalOpen} 
        onClose={() => setIsNovaFaturaModalOpen(false)} 
      />

      <DetalheFaturaModal 
        isOpen={isDetalhesFaturaModalOpen}
        onClose={() => setIsDetalhesFaturaModalOpen(false)}
        fatura={faturaAtual}
      />
    </div>
  );
};

export default FaturasPage;
