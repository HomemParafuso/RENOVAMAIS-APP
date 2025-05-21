
import React, { useState, useEffect, useRef } from "react";
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
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface CodigoConcessionaria {
  codigo: string;
  endereco: string;
}

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  tipoCalculo: string;
  percentualEconomia?: number;
  valorFixo?: number;
  tipoIluminacao?: string;
  valorIluminacao?: number;
  percentualIluminacao?: number;
}

interface ResumoCalculo {
  valorTotal: number;
  valorDesconto: number;
  valorFinal: number;
}

const NovaFaturaModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [cliente, setCliente] = useState("");
  const [codigosConcessionaria, setCodigosConcessionaria] = useState<CodigoConcessionaria[]>([]);
  const [codigoSelecionado, setCodigoSelecionado] = useState("");
  const [cpf, setCpf] = useState("");
  const [referencia, setReferencia] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [leituraAnterior, setLeituraAnterior] = useState("");
  const [leituraAtual, setLeituraAtual] = useState("");
  const [resumoCalculo, setResumoCalculo] = useState<ResumoCalculo | null>(null);
  const [clienteData, setClienteData] = useState<Cliente | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  const clientes = [
    { id: "1", nome: "Pablio Tacyanno", cpf: "123.456.789-00", tipoCalculo: "percentual", percentualEconomia: 10, tipoIluminacao: "fixo", valorIluminacao: 25 }
  ];
  
  const handleClienteChange = (value: string) => {
    setCliente(value);
    const selectedCliente = clientes.find(c => c.id === value);
    
    if (selectedCliente) {
      setClienteData(selectedCliente);
      setCpf(selectedCliente.cpf);
      
      // Simular os códigos de concessionária para o cliente selecionado
      setCodigosConcessionaria([
        { codigo: "7025079684", endereco: "RUA MONSENHOR SEVERIANO, 38, CASA 8" }
      ]);
    } else {
      setClienteData(null);
      setCpf("");
      setCodigosConcessionaria([]);
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
    
    // Cálculo simulado da fatura
    const consumo = Number(leituraAtual) - Number(leituraAnterior);
    const valorKwh = 0.75; // Valor simulado por kWh
    const valorTotal = consumo * valorKwh;
    
    let valorDesconto = 0;
    if (clienteData.tipoCalculo === "percentual" && clienteData.percentualEconomia) {
      valorDesconto = valorTotal * (clienteData.percentualEconomia / 100);
    } else if (clienteData.tipoCalculo === "fixo" && clienteData.valorFixo) {
      valorDesconto = clienteData.valorFixo;
    }
    
    const valorFinal = valorTotal - valorDesconto;
    
    setResumoCalculo({
      valorTotal,
      valorDesconto,
      valorFinal
    });
    
    toast({
      title: "Cálculo realizado",
      description: "O cálculo da fatura foi realizado com sucesso.",
    });
  };
  
  const handleSalvarFatura = () => {
    if (!resumoCalculo) {
      calcularFatura();
      return;
    }
    
    toast({
      title: "Fatura criada",
      description: "A fatura foi criada com sucesso!",
    });
    onClose();
  };
  
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleUploadArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Em uma implementação real, aqui faríamos o upload do arquivo e extrairíamos as informações
      toast({
        title: "Arquivo carregado",
        description: `O arquivo ${file.name} foi carregado com sucesso e as informações foram extraídas.`,
      });
      
      // Simulação de dados extraídos do arquivo
      setCliente("1");
      setCpf("123.456.789-00");
      setCodigoSelecionado("7025079684");
      setReferencia("05/2025");
      setVencimento("2025-05-10");
      setLeituraAnterior("1000");
      setLeituraAtual("1200");
      
      // Simulação do cliente selecionado
      setClienteData(clientes[0]);
      
      // Simulação dos códigos de concessionária
      setCodigosConcessionaria([
        { codigo: "7025079684", endereco: "RUA MONSENHOR SEVERIANO, 38, CASA 8" }
      ]);
      
      // Simulação do cálculo
      setResumoCalculo({
        valorTotal: 150,
        valorDesconto: 15,
        valorFinal: 135
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Inserção Manual</TabsTrigger>
            <TabsTrigger value="arquivo">Upload de Arquivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <Select value={cliente} onValueChange={handleClienteChange}>
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
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
                    <h3 className="text-lg font-medium mb-2">Resumo do Cálculo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor Total:</span>
                        <span>R$ {resumoCalculo.valorTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desconto:</span>
                        <span className="text-green-600">- R$ {resumoCalculo.valorDesconto.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Valor Final:</span>
                        <span>R$ {resumoCalculo.valorFinal.toFixed(2)}</span>
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
          
          <TabsContent value="arquivo" className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
              <Upload className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Arraste e solte um arquivo PDF ou JPEG da fatura</p>
              <p className="text-xs text-gray-500 mt-1">ou</p>
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleUploadArquivo}
                />
                <Button 
                  variant="outline" 
                  className="relative"
                  onClick={handleSelectFileClick}
                >
                  Selecionar arquivo
                </Button>
              </div>
            </div>
            
            {resumoCalculo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Resumo da Fatura</h3>
                    <p className="text-sm text-gray-500">Dados extraídos automaticamente</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setResumoCalculo(null)}
                  >
                    Ajustar
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-gray-600">Cliente</Label>
                    <p className="font-medium">{clientes.find(c => c.id === cliente)?.nome || ''}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Código</Label>
                    <p className="font-medium">{codigoSelecionado}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-gray-600">Referência</Label>
                    <p className="font-medium">{referencia}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Vencimento</Label>
                    <p className="font-medium">{vencimento}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-gray-600">Leitura Anterior</Label>
                    <p className="font-medium">{leituraAnterior} kWh</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Leitura Atual</Label>
                    <p className="font-medium">{leituraAtual} kWh</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-inner mt-4">
                  <h4 className="text-md font-medium mb-2">Cálculo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Total:</span>
                      <span>R$ {resumoCalculo.valorTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="text-green-600">- R$ {resumoCalculo.valorDesconto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Valor Final:</span>
                      <span>R$ {resumoCalculo.valorFinal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvarFatura}>
            {resumoCalculo ? "Salvar Fatura" : "Calcular e Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaFaturaModal;
