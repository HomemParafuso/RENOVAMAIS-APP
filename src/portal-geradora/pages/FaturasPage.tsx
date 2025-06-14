import React, { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Edit, Bell, Download, Share2, Upload, FileText, Trash2, RefreshCcw, AlertCircle, QrCode } from "lucide-react";
import { faturaService } from "@/services/faturaService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NovaFaturaModal from "@/components/fatura/NovaFaturaModal";
import DetalheFaturaModal from "@/components/fatura/DetalheFaturaModal";
import CompartilharFaturaModal from "@/components/fatura/CompartilharFaturaModal";
import CompartilharFaturaPDFModal from "@/components/fatura/CompartilharFaturaPDFModal";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useInvoice } from '@/context/InvoiceContext';
import { Fatura } from '@/lib/firebase'; // Importar Fatura do Firebase

interface CodigoConcessionaria {
  codigo: string;
  endereco: string;
}

const FaturasPage = () => {
  const [isNovaFaturaModalOpen, setIsNovaFaturaModalOpen] = useState(false);
  const [isDetalhesFaturaModalOpen, setIsDetalhesFaturaModalOpen] = useState(false);
  const [isCompartilharModalOpen, setIsCompartilharModalOpen] = useState(false);
  const [isCompartilharPDFModalOpen, setIsCompartilharPDFModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isReverterEstornoModalOpen, setIsReverterEstornoModalOpen] = useState(false);
  const [faturaAtual, setFaturaAtual] = useState<Fatura | undefined>(undefined);
  const [faturaParaEdicao, setFaturaParaEdicao] = useState<Fatura | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const { invoices, loading: invoicesLoading, updateInvoiceStatus, removeInvoice, addInvoice } = useInvoice();
  const [sortColumn, setSortColumn] = useState<keyof Fatura | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const handleVerDetalhes = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsDetalhesFaturaModalOpen(true);
  };

  const handleEditarFatura = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    
    // Se a fatura estiver estornada, abre o modal de reverter estorno
    if (fatura.status === 'overdue') { // Usar 'overdue'
      setIsReverterEstornoModalOpen(true);
    } else if (fatura.status === 'pending') { // Permitir edição apenas se o status for 'pending'
      setFaturaParaEdicao(fatura); // Definir a fatura para ser editada
      setIsNovaFaturaModalOpen(true); // Abrir o NovaFaturaModal
    } else {
      // Para outros status, mostra a mensagem
      toast({
        title: "Edição de fatura",
        description: `A edição de faturas com status '${fatura.status}' não é permitida.`,
      });
    }
  };
  
  const handleReverterEstorno = async () => {
    if (!faturaAtual || !faturaAtual.id) return;

    // Atualiza o status da fatura no Firebase para "paid" e define a data do status como a data atual
    await updateInvoiceStatus(faturaAtual.id, "paid", new Date());
    
    toast({
      title: "Estorno revertido",
      description: `O estorno da fatura de ${faturaAtual.reference} foi revertido com sucesso.`,
    });
    
    setIsReverterEstornoModalOpen(false);
    setFaturaAtual(undefined);
  };

  const handleNotificarCliente = (fatura: Fatura) => {
    toast({
      title: "Cliente notificado",
      description: `Notificação enviada para ${fatura.description} sobre a fatura de ${fatura.reference}.`,
    });
  };

  const handleDownloadFatura = (fatura: Fatura) => {
    if (fatura.pdfUrl) {
      window.open(fatura.pdfUrl, '_blank');
    } else {
      toast({
        title: "Erro no download",
        description: "PDF da fatura não disponível. Certifique-se de que a fatura foi importada com um arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const handleGerarQRCode = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsCompartilharModalOpen(true);
  };

  const handleCompartilharFatura = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsCompartilharPDFModalOpen(true);
  };

  const handleEstornarPagamento = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsExcluirModalOpen(true);
  };

  const handleSort = (column: keyof Fatura) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filtra as faturas com base no status selecionado e aplica a ordenação
  const faturasFiltradas = useMemo(() => {
    let faturasOrdenadas = [...invoices];

    if (sortColumn) {
      faturasOrdenadas.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortColumn === 'dataStatus' || sortColumn === 'dueDate' || sortColumn === 'createdAt' || sortColumn === 'updatedAt') {
          const dateA = aValue instanceof Date ? aValue.getTime() : (aValue ? new Date(aValue as string).getTime() : 0);
          const dateB = bValue instanceof Date ? bValue.getTime() : (bValue ? new Date(bValue as string).getTime() : 0);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortColumn === 'amount' || sortColumn === 'valorTotalExtraido' || sortColumn === 'leituraAnterior' || sortColumn === 'leituraAtual') {
          const numA = typeof aValue === 'number' ? aValue : parseFloat(String(aValue).replace('R$', '').replace(',', '.'));
          const numB = typeof bValue === 'number' ? bValue : parseFloat(String(bValue).replace('R$', '').replace(',', '.'));
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0; // Não comparável
      });
    }

    if (filtroStatus === "todos") {
      return faturasOrdenadas;
    } else if (filtroStatus === "overdue") {
      return faturasOrdenadas.filter(fatura => fatura.status === "overdue");
    } else if (filtroStatus === "pending") {
      return faturasOrdenadas.filter(fatura => fatura.status === "pending");
    } else if (filtroStatus === "paid") {
      return faturasOrdenadas.filter(fatura => fatura.status === "paid");
    }
    return faturasOrdenadas; // Fallback
  }, [invoices, filtroStatus, sortColumn, sortDirection]);

  const confirmarEstorno = async () => {
    if (!faturaAtual || !faturaAtual.id) return;

    // Atualiza o status da fatura no Firebase para "overdue" e define a data do status como a data atual
    await updateInvoiceStatus(faturaAtual.id, "overdue", new Date());
    
    toast({
      title: "Estorno confirmado",
      description: `O pagamento da fatura de ${faturaAtual.reference} foi estornado com sucesso.`
    });
    
    setIsExcluirModalOpen(false);
    setFaturaAtual(undefined);
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setProcessError(null);
    setIsUploadModalOpen(true); // Abrir o modal para mostrar o status de processamento
    
    try {
      // Processar o arquivo usando o faturaService
      const { dadosFatura, cliente, resultado } = await faturaService.processarFatura(file);
      
      if (!dadosFatura || !resultado) { // Verifica se dadosFatura e resultado são válidos
        throw new Error("Não foi possível extrair dados ou calcular a fatura a partir do PDF");
      }
      
      // Criar dados da fatura para adicionar ao Firestore
      const newInvoiceData: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'pdfUrl'> = {
        description: cliente?.nome || dadosFatura.cliente || "Cliente não identificado",
        reference: dadosFatura.referencia || "",
        dueDate: dadosFatura.vencimento ? new Date(dadosFatura.vencimento.split('/').reverse().join('-')) : new Date(),
        leituraAnterior: dadosFatura.leituraAnterior || 0,
        leituraAtual: dadosFatura.leituraAtual || 0,
        amount: resultado.valorFinal,
        valorTotalExtraido: dadosFatura.valorTotal || 0,
        status: "pending" as const,
        dataStatus: new Date(),
        codigoConcessionaria: dadosFatura.codigoConcessionaria || '',
      };

      // Adicionar a fatura ao Firestore, incluindo o arquivo PDF para upload
      await addInvoice(newInvoiceData, file);
      
      toast({
        title: "Fatura importada e calculada",
        description: "A fatura foi processada e adicionada com sucesso.",
      });

      // Fechar o modal de upload após o sucesso
      setIsUploadModalOpen(false);
      
    } catch (error: any) {
      console.error("Erro ao processar fatura:", error);
      setProcessError(error.message || "Ocorreu um erro ao processar o arquivo. Tente novamente ou insira os dados manualmente.");
      
      toast({
        title: "Erro no processamento",
        description: error.message || "Não foi possível processar o arquivo da fatura.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      // Limpar o input file para que o mesmo arquivo possa ser selecionado novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Faturas</h1>
          <p className="text-muted-foreground">Gerencie todas as faturas da sua usina solar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Importar Fatura
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setFaturaParaEdicao(undefined); setIsNovaFaturaModalOpen(true); }}>
            <span className="mr-2">+</span>
            Nova Fatura
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por cliente ou referência"
            className="pl-10"
          />
        </div>
        <Select 
          defaultValue="todos"
          value={filtroStatus}
          onValueChange={setFiltroStatus}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="overdue">Atrasado</SelectItem>
            <SelectItem value="overdue">Estornada</SelectItem>
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
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-8 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('description')}>
            Cliente {sortColumn === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('reference')}>
            Referência {sortColumn === 'reference' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('dueDate')}>
            Vencimento {sortColumn === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('amount')}>
            Valor {sortColumn === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('status')}>
            Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="cursor-pointer flex items-center">
            Notificado
          </div>
          <div className="cursor-pointer flex items-center" onClick={() => handleSort('dataStatus')}>
            Data do Status {sortColumn === 'dataStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="text-right">Ações</div>
        </div>
        
        {invoicesLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-600">Carregando faturas...</p>
          </div>
        ) : faturasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhuma fatura encontrada.</div>
        ) : (
          faturasFiltradas.map((fatura) => (
          <div 
            key={fatura.id} 
              className="grid grid-cols-8 px-6 py-4 border-b last:border-0 items-center cursor-pointer hover:bg-gray-50"
            onClick={() => handleVerDetalhes(fatura)}
          >
              <div className="text-blue-600 hover:underline cursor-pointer">{fatura.description || '-'}</div>
              <div>{fatura.reference || '-'}</div>
              <div>{fatura.dueDate?.toLocaleDateString('pt-BR') || '-'}</div>
              <div>{fatura.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  fatura.status === 'paid'
                  ? 'bg-green-100 text-green-800' 
                    : fatura.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800' 
                      : fatura.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                  {fatura.status === 'paid' ? 'Pago' : fatura.status === 'pending' ? 'Pendente' : fatura.status === 'overdue' ? 'Atrasado' : 'Desconhecido'}
              </span>
            </div>
            <div className="text-red-500">
                {/* Notificado não existe diretamente na Fatura do Firebase, remover ou adicionar lógica */}
                <span>✕</span> {/* Placeholder */}
            </div>
              <div>{fatura.dataStatus?.toLocaleDateString('pt-BR') || '-'}</div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleVerDetalhes(fatura); }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleNotificarCliente(fatura); }}
                      disabled={fatura.status === 'overdue'}
                      className={fatura.status === 'overdue' ? "text-gray-400 cursor-not-allowed" : ""}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notificar Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadFatura(fatura); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Fatura
                  </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); handleEditarFatura(fatura); }}
                      disabled={fatura.status === 'paid' || fatura.status === 'overdue'}
                      className={fatura.status === 'paid' || fatura.status === 'overdue' ? "text-gray-400 cursor-not-allowed" : ""}
                    >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleGerarQRCode(fatura); }}
                    disabled={fatura.status === 'overdue'}
                    className={fatura.status === 'overdue' ? "text-gray-400 cursor-not-allowed" : ""}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCompartilharFatura(fatura); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar Fatura
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleEstornarPagamento(fatura); }}
                      disabled={fatura.status === 'overdue'}
                      className={fatura.status === 'overdue'
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancelar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          ))
        )}
      </div>

      <NovaFaturaModal 
        isOpen={isNovaFaturaModalOpen} 
        onClose={() => { setIsNovaFaturaModalOpen(false); setFaturaParaEdicao(undefined); }} // Reset faturaParaEdicao on close
        faturaParaEdicao={faturaParaEdicao} // Passa a fatura para edição
      />

      <DetalheFaturaModal 
        isOpen={isDetalhesFaturaModalOpen}
        onClose={() => setIsDetalhesFaturaModalOpen(false)}
        fatura={faturaAtual}
      />

      <CompartilharFaturaModal
        isOpen={isCompartilharModalOpen}
        onClose={() => setIsCompartilharModalOpen(false)}
        fatura={faturaAtual}
      />

      <CompartilharFaturaPDFModal
        isOpen={isCompartilharPDFModalOpen}
        onClose={() => setIsCompartilharPDFModalOpen(false)}
        fatura={faturaAtual}
      />
      
      {/* Modal para revisão de fatura importada (agora apenas indicador de processamento) */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Processando Fatura</DialogTitle>
            <DialogDescription>
              Estamos analisando e importando os dados da sua fatura. Por favor, aguarde.
            </DialogDescription>
          </DialogHeader>
          
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Processando arquivo...</p>
              <p className="text-xs text-gray-500 mt-1">Extraindo dados e calculando valores</p>
            </div>
          )}
          
          {processError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Erro no processamento</h4>
                  <p className="text-xs text-red-700 mt-1">{processError}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isProcessing && !processError && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-600">Nenhum arquivo em processamento.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de estorno */}
      <Dialog open={isExcluirModalOpen} onOpenChange={setIsExcluirModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar estorno de pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estornar o pagamento desta fatura? Esta ação alterará o balanço financeiro da empresa e a devolução ao cliente deverá ser processada manualmente pelo sistema bancário.
            </DialogDescription>
          </DialogHeader>
          
          {faturaAtual && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-sm">{faturaAtual.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-sm">{faturaAtual.reference || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-sm">{faturaAtual.dueDate?.toLocaleDateString('pt-BR') || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-sm">{faturaAtual.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExcluirModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEstorno}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Estornar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de reversão de estorno */}
      <Dialog open={isReverterEstornoModalOpen} onOpenChange={setIsReverterEstornoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reverter estorno de pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja reverter o estorno desta fatura? Esta ação adicionará um crédito ao menu de recebimentos e alterará o balanço financeiro da empresa.
            </DialogDescription>
          </DialogHeader>
          
          {faturaAtual && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-sm">{faturaAtual.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-sm">{faturaAtual.reference || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-sm">{faturaAtual.dueDate?.toLocaleDateString('pt-BR') || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-sm">{faturaAtual.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReverterEstornoModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleReverterEstorno}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reverter Estorno
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaturasPage;
