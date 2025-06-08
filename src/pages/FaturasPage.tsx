import React, { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Edit, Bell, Download, QrCode, Share2, Upload, FileText, Trash2, RefreshCcw, AlertCircle } from "lucide-react";
import { faturaService } from "@/services/faturaService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NovaFaturaModal from "@/components/fatura/NovaFaturaModal";
import DetalheFaturaModal from "@/components/fatura/DetalheFaturaModal";
import QrCodeFaturaModal from "@/components/fatura/QrCodeFaturaModal";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Fatura {
  id: number;
  cliente: string;
  referencia: string;
  vencimento: string;
  valor: string;
  status: string;
  notificado: boolean;
  endereco?: string;
  leituraAnterior?: number;
  leituraAtual?: number;
}

const FaturasPage = () => {
  const [isNovaFaturaModalOpen, setIsNovaFaturaModalOpen] = useState(false);
  const [isDetalhesFaturaModalOpen, setIsDetalhesFaturaModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [faturaAtual, setFaturaAtual] = useState<Fatura | undefined>(undefined);
  const [faturaPreview, setFaturaPreview] = useState<Partial<Fatura> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [filtroStatus, setFiltroStatus] = useState<string>("todos-status");
  const [faturas, setFaturas] = useState<Fatura[]>([]);

  // Carregar faturas do localStorage na inicialização
  useEffect(() => {
    const faturasArmazenadas = localStorage.getItem('faturas');
    
    if (faturasArmazenadas) {
      setFaturas(JSON.parse(faturasArmazenadas));
    } else {
      // Dados iniciais se não houver nada no localStorage
      const dadosIniciais = [
        {
          id: 1,
          cliente: "João Silva",
          referencia: "05/2025",
          vencimento: "10/05/2025",
          valor: "R$ 350,00",
          status: "Pago",
          notificado: true,
          endereco: "Av. Principal, 123 - Centro",
          leituraAnterior: 1200,
          leituraAtual: 1650
        },
        {
          id: 2,
          cliente: "Maria Santos",
          referencia: "04/2025",
          vencimento: "05/04/2025",
          valor: "R$ 280,00",
          status: "Estornada",
          notificado: true,
          endereco: "Rua das Flores, 45 - Jardim",
          leituraAnterior: 950,
          leituraAtual: 1320
        }
      ];
      
      setFaturas(dadosIniciais);
      localStorage.setItem('faturas', JSON.stringify(dadosIniciais));
    }
  }, []);

  const handleVerDetalhes = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsDetalhesFaturaModalOpen(true);
  };

  const handleEditarFatura = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    toast({
      title: "Edição de fatura",
      description: `A edição da fatura será implementada em breve.`,
    });
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
    setFaturaAtual(fatura);
    setIsQrCodeModalOpen(true);
  };

  const handleCompartilharFatura = (fatura: Fatura) => {
    toast({
      title: "Link de compartilhamento gerado",
      description: `A fatura de ${fatura.referencia} está pronta para ser compartilhada.`,
    });
  };

  const handleEstornarPagamento = (fatura: Fatura) => {
    setFaturaAtual(fatura);
    setIsExcluirModalOpen(true);
  };

  // Filtra as faturas com base no status selecionado
  const faturasFiltradas = useMemo(() => {
    if (filtroStatus === "todos-status") {
      return faturas.filter(fatura => fatura.status !== "Estornada");
    } else if (filtroStatus === "estornada") {
      return faturas.filter(fatura => fatura.status === "Estornada");
    } else {
      return faturas.filter(fatura => fatura.status === filtroStatus);
    }
  }, [faturas, filtroStatus]);

  // Salvar faturas no localStorage sempre que forem alteradas
  useEffect(() => {
    if (faturas.length > 0) {
      localStorage.setItem('faturas', JSON.stringify(faturas));
    }
  }, [faturas]);

  const confirmarEstorno = () => {
    if (!faturaAtual) return;
    
    // Em um sistema real, registraríamos o estorno no banco de dados
    // Aqui apenas simulamos a operação alterando o status da fatura
    const faturasAtualizadas = faturas.map(fatura => 
      fatura.id === faturaAtual.id 
        ? { ...fatura, status: "Estornada" } 
        : fatura
    );
    
    // Atualiza o estado e salva no localStorage
    setFaturas(faturasAtualizadas);
    localStorage.setItem('faturas', JSON.stringify(faturasAtualizadas));
    
    toast({
      title: "Pagamento estornado",
      description: `O pagamento da fatura de ${faturaAtual.referencia} foi estornado com sucesso. Lembre-se de processar a devolução pelo sistema bancário.`,
    });
    
    setIsExcluirModalOpen(false);
    setFaturaAtual(undefined);
  };
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setProcessError(null);
    
    toast({
      title: "Processando arquivo",
      description: "Analisando dados da fatura...",
    });
    
    try {
      // Processar o arquivo usando o faturaService
      const { dadosFatura, cliente, resultado } = await faturaService.processarFatura(file);
      
      if (!dadosFatura) {
        throw new Error("Não foi possível extrair dados da fatura");
      }
      
      // Criar prévia da fatura com os dados extraídos
      const faturaData: Partial<Fatura> = {
        cliente: cliente?.nome || "Cliente não identificado",
        referencia: dadosFatura.referencia || "",
        vencimento: dadosFatura.vencimento || "",
        endereco: "Endereço extraído da fatura",
        leituraAnterior: dadosFatura.leituraAnterior,
        leituraAtual: dadosFatura.leituraAtual,
        valor: resultado ? `R$ ${resultado.valorFinal.toFixed(2)}` : "Valor não calculado",
        status: "Pendente"
      };
      
      setFaturaPreview(faturaData);
      setIsUploadModalOpen(true);
      
      toast({
        title: "Arquivo processado",
        description: "Os dados da fatura foram extraídos com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao processar fatura:", error);
      setProcessError("Ocorreu um erro ao processar o arquivo. Tente novamente ou insira os dados manualmente.");
      
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo da fatura.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Schema para o formulário de confirmação
  const faturaSchema = z.object({
    cliente: z.string().min(1, "Cliente é obrigatório"),
    referencia: z.string().min(1, "Referência é obrigatória"),
    vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
    endereco: z.string().min(1, "Endereço é obrigatório"),
    leituraAnterior: z.coerce.number().min(0, "Leitura anterior inválida"),
    leituraAtual: z.coerce.number().min(0, "Leitura atual inválida")
      .refine(val => val > (faturaPreview?.leituraAnterior || 0), {
        message: "A leitura atual deve ser maior que a anterior",
      }),
    valor: z.string().min(1, "Valor é obrigatório"),
  });
  
  const form = useForm<z.infer<typeof faturaSchema>>({
    resolver: zodResolver(faturaSchema),
    defaultValues: {
      cliente: faturaPreview?.cliente || "",
      referencia: faturaPreview?.referencia || "",
      vencimento: faturaPreview?.vencimento || "",
      endereco: faturaPreview?.endereco || "",
      leituraAnterior: faturaPreview?.leituraAnterior || 0,
      leituraAtual: faturaPreview?.leituraAtual || 0,
      valor: faturaPreview?.valor || "",
    },
  });
  
  // Atualizar formulário quando faturaPreview mudar
  React.useEffect(() => {
    if (faturaPreview) {
      form.reset({
        cliente: faturaPreview.cliente || "",
        referencia: faturaPreview.referencia || "",
        vencimento: faturaPreview.vencimento || "",
        endereco: faturaPreview.endereco || "",
        leituraAnterior: faturaPreview.leituraAnterior || 0,
        leituraAtual: faturaPreview.leituraAtual || 0,
        valor: faturaPreview.valor || "",
      });
    }
  }, [faturaPreview, form]);
  
  const handleConfirmarFatura = (data: z.infer<typeof faturaSchema>) => {
    // Em um sistema real, salvaríamos a fatura no banco de dados
    toast({
      title: "Fatura confirmada",
      description: `Fatura de ${data.cliente} para o período ${data.referencia} foi criada com sucesso.`,
    });
    
    setIsUploadModalOpen(false);
    
    // Limpar referências
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Atualizar a lista de faturas (em um sistema real, recarregaríamos do banco)
    // Aqui apenas simulamos a exibição da nova fatura
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
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsNovaFaturaModalOpen(true)}>
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
          defaultValue="todos-status" 
          value={filtroStatus}
          onValueChange={setFiltroStatus}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos-status">Ativos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
            <SelectItem value="estornada">Estornada</SelectItem>
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
        <div className="grid grid-cols-7 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Cliente</div>
          <div>Referência</div>
          <div>Vencimento</div>
          <div>Valor</div>
          <div>Status</div>
          <div>Notificado</div>
          <div className="text-right">Ações</div>
        </div>
        
        {faturasFiltradas.map((fatura) => (
          <div 
            key={fatura.id} 
            className="grid grid-cols-7 px-6 py-4 border-b last:border-0 items-center cursor-pointer hover:bg-gray-50"
            onClick={() => handleVerDetalhes(fatura)}
          >
            <div>{fatura.cliente}</div>
            <div>{fatura.referencia || '-'}</div>
            <div>{fatura.vencimento}</div>
            <div>{fatura.valor}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                fatura.status === 'Pago' 
                  ? 'bg-green-100 text-green-800' 
                  : fatura.status === 'Pendente' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : fatura.status === 'Estornada'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-red-100 text-red-800'
              }`}>
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
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleNotificarCliente(fatura); }}>
                    <Bell className="h-4 w-4 mr-2" />
                    Notificar Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadFatura(fatura); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Fatura
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditarFatura(fatura); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleGerarQRCode(fatura); }}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCompartilharFatura(fatura); }}>
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

      <QrCodeFaturaModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        fatura={faturaAtual}
      />
      
      {/* Modal para revisão de fatura importada */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Revisão de fatura importada</DialogTitle>
            <DialogDescription>
              Verifique os dados extraídos da fatura e faça os ajustes necessários.
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
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleConfirmarFatura)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referência</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leituraAnterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leitura Anterior (kWh)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="leituraAtual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leitura Atual (kWh)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {form.getValues('leituraAnterior') && form.getValues('leituraAtual') && (
                <div className="bg-gray-50 p-3 rounded-md border">
                  <p className="text-sm font-medium">Consumo calculado: {form.getValues('leituraAtual') - form.getValues('leituraAnterior')} kWh</p>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Confirmar Fatura
                </Button>
              </DialogFooter>
            </form>
          </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
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
                  <p className="text-sm">{faturaAtual.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-sm">{faturaAtual.referencia}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-sm">{faturaAtual.vencimento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-sm">{faturaAtual.valor}</p>
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
    </div>
  );
};

export default FaturasPage;
