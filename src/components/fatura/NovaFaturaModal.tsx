import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { faturaService, DadosFatura, ResultadoCalculo } from "@/services/faturaService";
import { clienteService, ClienteApp } from "@/services/clienteService";
import { useInvoice } from '@/context/InvoiceContext';
import { useAuth } from '@/context/AuthContext';
import { Fatura } from '@/lib/firebase';

interface CodigoConcessionaria {
  codigo: string;
  endereco: string;
}

interface ResumoCalculo {
  valorTotal: number;
  valorDesconto: number;
  valorFinal: number;
  detalhes: {
    consumo: number;
    tusd?: number;
    te?: number;
    valorIluminacao?: number;
    fonteTarifa?: string;
  };
}

interface NovaFaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaParaEdicao?: Fatura;
}

const NovaFaturaModal = ({ isOpen, onClose, faturaParaEdicao }: NovaFaturaModalProps) => {
  const [cliente, setCliente] = useState("");
  const [codigosConcessionaria, setCodigosConcessionaria] = useState<CodigoConcessionaria[]>([]);
  const [codigoSelecionado, setCodigoSelecionado] = useState("");
  const [cpf, setCpf] = useState("");
  const [referencia, setReferencia] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [leituraAnterior, setLeituraAnterior] = useState("");
  const [leituraAtual, setLeituraAtual] = useState("");
  const [resumoCalculo, setResumoCalculo] = useState<ResumoCalculo | null>(null);
  const [clienteData, setClienteData] = useState<ClienteApp | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { addInvoice, updateInvoice } = useInvoice();
  const { user, loading: authLoading } = useAuth();
  
  const [allClients, setAllClients] = useState<ClienteApp[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      const fetchClients = async () => {
        try {
          const fetchedClients = await clienteService.getAll();
          setAllClients(fetchedClients);
        } catch (error) {
          console.error("Erro ao carregar clientes:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar a lista de clientes.",
            variant: "destructive"
          });
        }
      };
      fetchClients();
    }
  }, [isOpen, toast]);
  
  useEffect(() => {
    if (faturaParaEdicao && isOpen && allClients.length > 0) { // Garante que allClients esteja carregado
      const clienteRealDaFatura = allClients.find(c => c.id === faturaParaEdicao.clienteId); // Assumindo faturaParaEdicao tem clienteId
      if (clienteRealDaFatura) {
        setCliente(clienteRealDaFatura.id);
        setClienteData(clienteRealDaFatura);
        setCpf(clienteRealDaFatura.cpf || clienteRealDaFatura.cpfCnpj || "");

        if (faturaParaEdicao.codigoConcessionaria) {
          setCodigoSelecionado(faturaParaEdicao.codigoConcessionaria);
          const foundImovel = clienteRealDaFatura.imoveis?.find(imovel => imovel.codigo === faturaParaEdicao.codigoConcessionaria);
          setCodigosConcessionaria([
            { codigo: faturaParaEdicao.codigoConcessionaria, endereco: foundImovel?.endereco || "Endereço associado" }
          ]);
        } else {
          setCodigosConcessionaria([]);
          setCodigoSelecionado("");
        }

        setReferencia(faturaParaEdicao.reference || "");
        setVencimento(faturaParaEdicao.dueDate?.toISOString().split('T')[0] || "");
        setLeituraAnterior(faturaParaEdicao.leituraAnterior?.toString() || "");
        setLeituraAtual(faturaParaEdicao.leituraAtual?.toString() || "");
        
        // Recalcular o resumo da fatura com os dados reais do cliente e leituras
        try {
          const dadosFaturaParaCalculo = {
            leituraAnterior: Number(faturaParaEdicao.leituraAnterior),
            leituraAtual: Number(faturaParaEdicao.leituraAtual),
          };
          const resultadoCalculado = faturaService.calcularFatura(dadosFaturaParaCalculo, clienteRealDaFatura);
          setResumoCalculo(resultadoCalculado);
        } catch (error) {
          console.error("Erro ao recalcular fatura para edição:", error);
          toast({
            title: "Erro",
            description: "Não foi possível recalcular a fatura para edição.",
            variant: "destructive"
          });
        }
      } else {
        console.warn("Cliente da fatura de edição não encontrado na lista de clientes carregados. Fallback para dados da fatura.");
        // Fallback: se o cliente real não for encontrado, ainda exibe os dados da fatura
        setCliente(faturaParaEdicao.description?.split(' - ')[0] || "");
        setCpf("");
        if (faturaParaEdicao.codigoConcessionaria) {
          setCodigoSelecionado(faturaParaEdicao.codigoConcessionaria);
          setCodigosConcessionaria([
            { codigo: faturaParaEdicao.codigoConcessionaria, endereco: "Endereço associado" }
          ]);
        } else {
          setCodigosConcessionaria([]);
          setCodigoSelecionado("");
        }
        setReferencia(faturaParaEdicao.reference || "");
        setVencimento(faturaParaEdicao.dueDate?.toISOString().split('T')[0] || "");
        setLeituraAnterior(faturaParaEdicao.leituraAnterior?.toString() || "");
        setLeituraAtual(faturaParaEdicao.leituraAtual?.toString() || "");
        setResumoCalculo({
          valorTotal: faturaParaEdicao.valorTotalExtraido || 0,
          valorDesconto: (faturaParaEdicao.valorTotalExtraido || 0) - (faturaParaEdicao.amount || 0),
          valorFinal: faturaParaEdicao.amount || 0,
          detalhes: {
            consumo: Number(faturaParaEdicao.leituraAtual) - Number(faturaParaEdicao.leituraAnterior),
            tusd: faturaParaEdicao.tusd, 
            te: faturaParaEdicao.te,
            valorIluminacao: faturaParaEdicao.valorIluminacao,
          },
        });
      }
    } else if (!faturaParaEdicao && isOpen) {
      // Resetar estados para nova fatura
      setCliente("");
      setCodigosConcessionaria([]);
      setCodigoSelecionado("");
      setCpf("");
      setReferencia("");
      setVencimento("");
      setLeituraAnterior("");
      setLeituraAtual("");
      setResumoCalculo(null);
      setClienteData(null);
    }
  }, [faturaParaEdicao, isOpen, allClients, toast]);
  
  const handleClienteChange = async (value: string) => {
    setCliente(value);
    if (value) {
      try {
        const fetchedClient = await clienteService.getById(value);
        if (fetchedClient) {
          setClienteData(fetchedClient);
          setCpf(fetchedClient.cpf || fetchedClient.cpfCnpj || "");
          if (fetchedClient.imoveis) {
            setCodigosConcessionaria(fetchedClient.imoveis.map(imovel => ({
              codigo: imovel.codigo,
              endereco: imovel.endereco
            })));
            if (fetchedClient.imoveis.length > 0) {
              setCodigoSelecionado(fetchedClient.imoveis[0].codigo);
            }
          } else {
            setCodigosConcessionaria([]);
            setCodigoSelecionado("");
          }
        } else {
          setClienteData(null);
          setCpf("");
          setCodigosConcessionaria([]);
          setCodigoSelecionado("");
          toast({
            title: "Cliente não encontrado",
            description: "Não foi possível carregar os dados do cliente selecionado.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
        setClienteData(null);
        setCpf("");
        setCodigosConcessionaria([]);
        setCodigoSelecionado("");
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive"
        });
      }
    } else {
      setClienteData(null);
      setCpf("");
      setCodigosConcessionaria([]);
      setCodigoSelecionado("");
    }
  };
  
  const calcularFatura = () => {
    if (!clienteData || !leituraAnterior || !leituraAtual) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos necessários para o cálculo.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Chamar o serviço de fatura para realizar o cálculo
      const dadosFaturaParaCalculo = {
        leituraAnterior: Number(leituraAnterior),
        leituraAtual: Number(leituraAtual),
      };
      const resultado = faturaService.calcularFatura(dadosFaturaParaCalculo, clienteData);
      setResumoCalculo(resultado);

      toast({
        title: "Cálculo realizado",
        description: "O cálculo da fatura foi realizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao calcular fatura:", error);
      toast({
        title: "Erro no cálculo",
        description: "Não foi possível realizar o cálculo da fatura. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSalvarFatura = async () => {
    if (!resumoCalculo) {
      calcularFatura();
      return;
    }

    try {
      const faturaDataToSave: Partial<Fatura> = {
        amount: resumoCalculo.valorFinal,
        dueDate: new Date(vencimento),
        status: faturaParaEdicao?.status || 'pending',
        description: `Fatura de ${clienteData?.nome || "Cliente não identificado"} - ${referencia || ""}`,
        reference: referencia || "",
        valorTotalExtraido: resumoCalculo.valorTotal,
        leituraAnterior: Number(leituraAnterior),
        leituraAtual: Number(leituraAtual),
        codigoConcessionaria: codigoSelecionado,
        dataStatus: new Date(),
        clienteId: clienteData?.id,
        tusd: resumoCalculo.detalhes.tusd,
        te: resumoCalculo.detalhes.te,
        valorIluminacao: resumoCalculo.detalhes.valorIluminacao,
      };

      if (faturaParaEdicao && faturaParaEdicao.id) {
        await updateInvoice(faturaParaEdicao.id, faturaDataToSave);
        toast({
          title: "Fatura atualizada",
          description: "A fatura foi atualizada com sucesso! Verifique a lista de faturas.",
        });
      } else {
        await addInvoice(faturaDataToSave as Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId'>);
        toast({
          title: "Fatura criada",
          description: "A fatura foi criada com sucesso! Verifique a lista de faturas.",
        });
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar fatura:", error);
      toast({
        title: "Erro ao salvar fatura",
        description: "Não foi possível salvar a fatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  
  const handleUploadArquivo = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | undefined;

    if ('dataTransfer' in e) { // DragEvent
      file = e.dataTransfer.files?.[0];
      e.preventDefault(); // Impede o comportamento padrão do navegador ao soltar o arquivo
      e.stopPropagation();
    } else { // ChangeEvent de input de arquivo
      file = e.target.files?.[0];
    }
    
    if (!file) return;
    
    setIsProcessing(true);
    setProcessError(null);
    setResumoCalculo(null); // Limpa o resumo de cálculo anterior para mostrar a área de upload/carregamento

    toast({
      title: "Processando arquivo",
      description: "Analisando dados da fatura...",
    });
    
    try {
      const { dadosFatura, cliente: clienteEncontrado, resultado } = await faturaService.processarFatura(file);
      
      if (!clienteEncontrado || !resultado) {
        setProcessError("Não foi possível identificar o cliente associado a esta fatura ou calcular os valores.");
        toast({
          title: "Erro no processamento",
          description: "Não foi possível processar completamente a fatura. Verifique os dados e tente novamente.",
          variant: "destructive"
        });
        return;
      }
      
      // Atualizar estados com os dados processados
      setCliente(clienteEncontrado.id); // Define o ID do cliente
      setClienteData(clienteEncontrado as ClienteApp); // Define os dados completos do cliente
      setCpf(clienteEncontrado.cpf || '');

      setCodigoSelecionado(dadosFatura.codigoConcessionaria || '');
      setReferencia(dadosFatura.referencia || '');
      // Garante que o formato da data seja compatível com input type="date" (YYYY-MM-DD)
      setVencimento(faturaService.formatDateForInput(dadosFatura.vencimento || '')); 
      setLeituraAnterior(dadosFatura.leituraAnterior?.toString() || '');
      setLeituraAtual(dadosFatura.leituraAtual?.toString() || '');
      setResumoCalculo(resultado); // Isso é crucial para esconder a área de upload

      // Simula os códigos de concessionária para o cliente selecionado, se necessário
      if (clienteEncontrado && dadosFatura.codigoConcessionaria) {
        setCodigosConcessionaria([
          { codigo: dadosFatura.codigoConcessionaria, endereco: "Endereço associado" }
        ]);
      } else {
          setCodigosConcessionaria([]); // Limpa se não houver código
      }

      toast({
        title: "Fatura processada",
        description: "Dados da fatura extraídos e cálculos realizados com sucesso! Agora você pode revisar e salvar.",
      });

    } catch (error) {
      console.error("Erro ao carregar fatura:", error);
      setProcessError("Erro ao processar o arquivo. Certifique-se de que é uma fatura válida.");
      toast({
        title: "Erro de upload",
        description: "Não foi possível fazer o upload da fatura. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{faturaParaEdicao ? "Editar Fatura" : "Nova Fatura"}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Inserção Manual</TabsTrigger>
            <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <Select value={cliente} onValueChange={handleClienteChange}>
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {/* {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
            
            {cliente && (
              <>
                <div>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">Código da Concessionária</label>
                  <Select value={codigoSelecionado} onValueChange={setCodigoSelecionado}>
                    <SelectTrigger id="codigo">
                      <SelectValue placeholder="Selecione o código" />
                    </SelectTrigger>
                    <SelectContent>
                      {codigosConcessionaria.map((item) => (
                        <SelectItem key={item.codigo} value={item.codigo}>
                          {item.codigo} - {item.endereco}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <Input id="cpf" readOnly value={cpf} className="bg-gray-100" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">Mês Referência</label>
                    <Input 
                      id="referencia" 
                      placeholder="MM/AAAA" 
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="vencimento" className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                    <Input 
                      id="vencimento" 
                      type="date" 
                      value={vencimento}
                      onChange={(e) => setVencimento(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leituraAnterior" className="block text-sm font-medium text-gray-700 mb-1">Leitura Anterior (kWh)</label>
                    <Input 
                      id="leituraAnterior" 
                      type="number" 
                      value={leituraAnterior}
                      onChange={(e) => setLeituraAnterior(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="leituraAtual" className="block text-sm font-medium text-gray-700 mb-1">Leitura Atual (kWh)</label>
                    <Input 
                      id="leituraAtual" 
                      type="number" 
                      value={leituraAtual}
                      onChange={(e) => setLeituraAtual(e.target.value)}
                    />
                  </div>
                </div>
                
                {resumoCalculo && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Resumo do Cálculo</h3>
                    
                    {clienteData && (
                      <div className="mb-3 p-2 bg-green-50 rounded-md">
                        <p className="text-xs text-green-700">
                          <span className="font-medium">Tipo de cálculo:</span> {clienteData.tipoCalculo === 'percentual' 
                            ? `Percentual de Economia (${clienteData.percentualEconomia}%)` 
                            : 'Valor Nominal'}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consumo:</span>
                        <span>{resumoCalculo.detalhes.consumo.toFixed(2).replace('.', ',')} kWh</span>
                      </div>
                      {resumoCalculo.detalhes.tusd !== undefined && resumoCalculo.detalhes.te !== undefined ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total TUSD+TE:</span>
                          <span>R$ {(resumoCalculo.detalhes.tusd + resumoCalculo.detalhes.te)?.toFixed(2) || '0.00'}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fonte da Tarifa:</span>
                          <span>Global (Configuração Geral)</span>
                        </div>
                      )}
                      {resumoCalculo.detalhes.valorIluminacao !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Iluminação Pública:</span>
                          <span>R$ {resumoCalculo.detalhes.valorIluminacao.toFixed(2).replace('.', ',')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-bold">Valor na Concessionária:</span>
                        <span className="font-bold">R$ {resumoCalculo.valorTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desconto:</span>
                        <span className="font-bold text-red-600">- R$ {resumoCalculo.valorDesconto.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t mt-2">
                        <span className="text-lg text-blue-700">Valor Final:</span>
                        <span className="text-lg text-blue-700">R$ {resumoCalculo.valorFinal.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {!resumoCalculo && (
                  <Button 
                    onClick={calcularFatura}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Calcular Fatura
                  </Button>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            {!resumoCalculo && (
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleUploadArquivo}
                onClick={handleSelectFileClick}
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-1">Arraste e solte um arquivo PDF ou JPEG da fatura</p>
                <p className="text-gray-500 mb-2">ou</p>
                <Button variant="outline" type="button">Selecionar arquivo</Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadArquivo}
                  className="hidden"
                  accept=".pdf,.jpeg,.jpg"
                />
              </div>
            )}
            {isProcessing && <p className="text-center text-blue-500">Processando...</p>}
            {processError && (
              <div className="flex items-center text-red-500 gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{processError}</span>
              </div>
            )}
            {resumoCalculo && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Resumo da Fatura</h3>
                <p className="text-sm text-gray-600 mb-4">Dados extraídos automaticamente</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                  <div>
                    <p className="text-gray-700">Cliente</p>
                    <p className="font-medium">{clienteData?.nome || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Código</p>
                    <p className="font-medium">{codigoSelecionado || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Referência</p>
                    <p className="font-medium">{referencia || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Vencimento</p>
                    <p className="font-medium">{new Date(vencimento).toLocaleDateString('pt-BR') || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Leitura Anterior</p>
                    <p className="font-medium">{leituraAnterior} kWh</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Leitura Atual</p>
                    <p className="font-medium">{leituraAtual} kWh</p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-md mb-4 border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2">Cálculo</h4>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                    <div>
                      <p className="font-bold">Valor na Concessionária:</p>
                      <p className="font-bold">R$ {resumoCalculo.valorTotal.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div>
                      <p className="text-gray-700">Consumo:</p>
                      <p className="font-medium">{resumoCalculo.detalhes.consumo.toFixed(2).replace('.', ',')} kWh</p>
                    </div>
                    {resumoCalculo.detalhes.valorIluminacao !== undefined && (
                      <div>
                        <p className="text-gray-700">Iluminação Pública:</p>
                        <p className="font-medium">R$ {resumoCalculo.detalhes.valorIluminacao.toFixed(2).replace('.', ',')}</p>
                      </div>
                    )}
                    {resumoCalculo.detalhes.tusd !== undefined && resumoCalculo.detalhes.te !== undefined && clienteData?.fonteTarifa === 'custom' ? (
                      <div>
                        <p className="text-gray-700">Total TUSD+TE:</p>
                        <p className="font-medium">R$ {(resumoCalculo.detalhes.tusd + resumoCalculo.detalhes.te).toFixed(2).replace('.', ',')}</p>
                      </div>
                    ) : (resumoCalculo.detalhes.fonteTarifa === 'global' &&
                      <div>
                        <p className="text-gray-700">Fonte da Tarifa:</p>
                        <p className="font-medium">Global (Configuração Geral)</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-700">Desconto:</p>
                      <p className="font-bold text-red-600">- R$ {resumoCalculo.valorDesconto.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="col-span-2 border-t pt-2 mt-2">
                      <p className="font-bold text-lg text-blue-700">Valor Final:</p>
                      <p className="font-bold text-lg text-blue-700">R$ {resumoCalculo.valorFinal.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={calcularFatura}>Ajustar</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSalvarFatura}
            disabled={isProcessing || !resumoCalculo || authLoading || !user}
          >
            {faturaParaEdicao ? "Salvar Edição" : "Salvar Fatura"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaFaturaModal;
