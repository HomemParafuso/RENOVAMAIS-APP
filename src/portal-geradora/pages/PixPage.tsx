
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  MoreVertical, 
  QrCode, 
  Copy, 
  Share2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Plus,
  Smartphone
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Badge
} from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PixCobranca {
  id: string;
  cliente: string;
  valor: number;
  descricao: string;
  dataVencimento: string;
  dataCriacao: string;
  dataPagamento?: string;
  status: "pendente" | "pago" | "expirado" | "cancelado";
  txid: string;
  qrCode: string;
  copiaECola: string;
}

const pixCobrancasData: PixCobranca[] = [
  {
    id: "1",
    cliente: "Pablio Tacyanno",
    valor: 150.00,
    descricao: "Fatura de energia - Maio/2025",
    dataVencimento: "10/05/2025",
    dataCriacao: "01/05/2025",
    status: "pendente",
    txid: "PIX123456789",
    qrCode: "00020126330014BR.GOV.BCB.PIX...",
    copiaECola: "00020126330014BR.GOV.BCB.PIX0114+5511999999999520400005303986540515.005802BR5925NOME DO RECEBEDOR6009SAO PAULO62070503***6304ABCD"
  },
  {
    id: "2",
    cliente: "Maria Empreendimentos",
    valor: 380.50,
    descricao: "Fatura de energia - Maio/2025",
    dataVencimento: "05/05/2025",
    dataCriacao: "01/05/2025",
    dataPagamento: "03/05/2025",
    status: "pago",
    txid: "PIX987654321",
    qrCode: "00020126330014BR.GOV.BCB.PIX...",
    copiaECola: "00020126330014BR.GOV.BCB.PIX0114+5511999999999520400005303986540380.505802BR5925NOME DO RECEBEDOR6009SAO PAULO62070503***6304EFGH"
  }
];

const PixPage = () => {
  const [pixCobrancas, setPixCobrancas] = useState<PixCobranca[]>(pixCobrancasData);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [isModalGerarOpen, setIsModalGerarOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [pixSelecionado, setPixSelecionado] = useState<PixCobranca | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Filtrar PIX por status
  const filtrarPix = () => {
    let pixFiltrados = [...pixCobrancas];
    
    if (filtroStatus !== "todos") {
      pixFiltrados = pixFiltrados.filter(p => p.status === filtroStatus);
    }
    
    return pixFiltrados;
  };

  const pixFiltrados = filtrarPix();
  const totalPages = Math.ceil(pixFiltrados.length / itemsPerPage);
  const currentItems = pixFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estatísticas
  const totalValorPendente = pixCobrancas.filter(p => p.status === "pendente").reduce((sum, p) => sum + p.valor, 0);
  const totalValorPago = pixCobrancas.filter(p => p.status === "pago").reduce((sum, p) => sum + p.valor, 0);
  const totalCobrancas = pixCobrancas.length;

  const handleCopiarCodigoECola = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast({
      title: "Código copiado",
      description: "Código Pix copia e cola copiado para a área de transferência.",
    });
  };

  const handleCompartilhar = async (pix: PixCobranca) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PIX - ${pix.cliente}`,
          text: `Cobrança PIX de R$ ${pix.valor.toFixed(2)} para ${pix.cliente}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      handleCopiarCodigoECola(pix.copiaECola);
    }
  };

  const handleEstornar = (pixId: string) => {
    setPixCobrancas(pixCobrancas.map(p => {
      if (p.id === pixId && p.status === "pago") {
        return { ...p, status: "cancelado" as const };
      }
      return p;
    }));
    
    toast({
      title: "PIX estornado",
      description: "A cobrança PIX foi estornada com sucesso.",
    });
  };

  const handleCancelar = (pixId: string) => {
    setPixCobrancas(pixCobrancas.map(p => {
      if (p.id === pixId && p.status === "pendente") {
        return { ...p, status: "cancelado" as const };
      }
      return p;
    }));
    
    toast({
      title: "PIX cancelado",
      description: "A cobrança PIX foi cancelada com sucesso.",
    });
  };

  const handleConsultarStatus = (pixId: string) => {
    // Simular consulta ao banco
    toast({
      title: "Consultando status",
      description: "Verificando status da cobrança no banco...",
    });
    
    setTimeout(() => {
      toast({
        title: "Status atualizado",
        description: "Status da cobrança verificado com sucesso.",
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "expirado": return "bg-red-100 text-red-800";
      case "cancelado": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago": return <CheckCircle className="h-4 w-4" />;
      case "pendente": return <Clock className="h-4 w-4" />;
      case "expirado": return <XCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento PIX</h1>
          <p className="text-muted-foreground">Gerencie suas cobranças PIX e recebimentos</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsModalGerarOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Gerar PIX
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cobranças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{totalCobrancas}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">cobranças criadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">R$ {totalValorPendente.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">aguardando pagamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">R$ {totalValorPago.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">já recebido</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <QrCode className="h-5 w-5 text-purple-500 mr-2" />
              <div className="text-2xl font-bold">
                {totalCobrancas > 0 ? Math.round((pixCobrancas.filter(p => p.status === "pago").length / totalCobrancas) * 100) : 0}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">cobranças pagas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar cobranças PIX"
              className="pl-10 min-w-[200px]"
            />
          </div>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="expirado">Expirado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Tabela de PIX */}
      <div className="bg-white rounded-md border">
        <Table>
          <TableCaption>Lista de cobranças PIX</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>TXID</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhuma cobrança PIX encontrada com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((pix) => (
                <TableRow key={pix.id}>
                  <TableCell className="font-medium">{pix.cliente}</TableCell>
                  <TableCell>{pix.descricao}</TableCell>
                  <TableCell className="font-mono text-sm">{pix.txid}</TableCell>
                  <TableCell>{pix.dataVencimento}</TableCell>
                  <TableCell className="text-right">R$ {pix.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(pix.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(pix.status)}
                        {pix.status.charAt(0).toUpperCase() + pix.status.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setPixSelecionado(pix);
                          setIsQrCodeModalOpen(true);
                        }}>
                          <QrCode className="h-4 w-4 mr-2" />
                          Ver QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopiarCodigoECola(pix.copiaECola)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Copia e Cola
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompartilhar(pix)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConsultarStatus(pix.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Consultar Status
                        </DropdownMenuItem>
                        {pix.status === "pago" && (
                          <DropdownMenuItem onClick={() => handleEstornar(pix.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Estornar
                          </DropdownMenuItem>
                        )}
                        {pix.status === "pendente" && (
                          <DropdownMenuItem onClick={() => handleCancelar(pix.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      <Dialog open={isQrCodeModalOpen} onOpenChange={setIsQrCodeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code PIX</DialogTitle>
            <DialogDescription>
              {pixSelecionado && `Cobrança para ${pixSelecionado.cliente} - R$ ${pixSelecionado.valor.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>
          
          {pixSelecionado && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
                <span className="ml-2 text-gray-500">QR Code aqui</span>
              </div>
              
              <div className="w-full">
                <Label htmlFor="copiaECola" className="text-sm font-medium">
                  Código Copia e Cola
                </Label>
                <div className="flex mt-1">
                  <Input 
                    id="copiaECola"
                    value={pixSelecionado.copiaECola} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="ml-2"
                    onClick={() => handleCopiarCodigoECola(pixSelecionado.copiaECola)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQrCodeModalOpen(false)}>
              Fechar
            </Button>
            {pixSelecionado && (
              <Button onClick={() => handleCompartilhar(pixSelecionado)}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PixPage;
