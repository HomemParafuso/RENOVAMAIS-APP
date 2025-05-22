
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Edit, Bell, Download, QrCode, Share2, Upload, FileText } from "lucide-react";
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
  const [faturaAtual, setFaturaAtual] = useState<Fatura | undefined>(undefined);
  const [faturaPreview, setFaturaPreview] = useState<Partial<Fatura> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const faturas: Fatura[] = [
    {
      id: 1,
      cliente: "Pablio Tacyanno",
      referencia: "05/2025",
      vencimento: "10/05/2025",
      valor: "R$ 150,00",
      status: "Pendente",
      notificado: false,
      endereco: "Rua das Flores, 123 - Centro",
      leituraAnterior: 1200,
      leituraAtual: 1350
    }
  ];

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
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Em um sistema real, aqui faríamos o upload e processamento do arquivo
    // Para simular, vamos criar uma prévia de fatura
    
    // Simular extração de dados do PDF
    setTimeout(() => {
      // Dados simulados que seriam extraídos do arquivo
      const dadosExtraidos = {
        cliente: "Pablio Tacyanno",
        referencia: "06/2025",
        vencimento: "15/06/2025",
        endereco: "Rua das Flores, 123 - Centro",
        leituraAnterior: 1350,
        leituraAtual: 1480
      };
      
      // Calcular valor baseado na leitura
      const consumo = dadosExtraidos.leituraAtual - dadosExtraidos.leituraAnterior;
      const valorKwh = 0.75; // R$ por kWh, em um sistema real viria da configuração do cliente
      const valorCalculado = (consumo * valorKwh).toFixed(2);
      
      setFaturaPreview({
        ...dadosExtraidos,
        valor: `R$ ${valorCalculado}`,
        status: "Pendente",
      });
      
      setIsUploadModalOpen(true);
    }, 1500);
    
    toast({
      title: "Processando arquivo",
      description: "Analisando dados da fatura...",
    });
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
                  <DropdownMenuItem onClick={() => handleEditarFatura(fatura)}>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaturasPage;
