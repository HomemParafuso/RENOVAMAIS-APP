
import React, { useState } from "react";
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

const NovaFaturaModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [cliente, setCliente] = useState("");
  const [codigosConcessionaria, setCodigosConcessionaria] = useState([
    { codigo: "7025079684", endereco: "RUA MONSENHOR SEVERIANO, 38, CASA 8" }
  ]);
  const [codigoSelecionado, setCodigoSelecionado] = useState("");
  const { toast } = useToast();
  
  const handleClienteChange = (value: string) => {
    setCliente(value);
    // Em uma implementação real, aqui buscaríamos os códigos de concessionária do cliente
    if (value) {
      setCodigosConcessionaria([
        { codigo: "7025079684", endereco: "RUA MONSENHOR SEVERIANO, 38, CASA 8" }
      ]);
    } else {
      setCodigosConcessionaria([]);
    }
  };
  
  const handleSalvarFatura = () => {
    toast({
      title: "Fatura criada",
      description: "A fatura foi criada com sucesso!",
    });
    onClose();
  };
  
  const handleUploadArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Em uma implementação real, aqui faríamos o upload do arquivo
      toast({
        title: "Arquivo carregado",
        description: `O arquivo ${file.name} foi carregado com sucesso e as informações foram extraídas.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
                  <SelectItem value="pablio">Pablio Tacyanno</SelectItem>
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
                  <Input id="cpf" readOnly value="" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">Mês Referência</label>
                    <Input id="referencia" placeholder="MM/AAAA" />
                  </div>
                  <div>
                    <label htmlFor="vencimento" className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                    <Input id="vencimento" type="date" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leituraAnterior" className="block text-sm font-medium text-gray-700 mb-1">Leitura Anterior (kWh)</label>
                    <Input id="leituraAnterior" type="number" />
                  </div>
                  <div>
                    <label htmlFor="leituraAtual" className="block text-sm font-medium text-gray-700 mb-1">Leitura Atual (kWh)</label>
                    <Input id="leituraAtual" type="number" />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="arquivo" className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
              <Upload className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Arraste e solte um arquivo PDF ou JPEG da fatura</p>
              <p className="text-xs text-gray-500 mt-1">ou</p>
              <div className="mt-4">
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  <Button variant="outline" className="relative">
                    Selecionar arquivo
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      className="sr-only"
                      onChange={handleUploadArquivo}
                    />
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvarFatura}>
            Salvar Fatura
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaFaturaModal;
