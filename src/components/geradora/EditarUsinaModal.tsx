import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface UsinaGeradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  endereco?: string;
  cnpj?: string;
  status: string;
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
  descricao?: string;
  dataInstalacao?: string;
  dataCadastro?: string;
}

interface EditarUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: UsinaGeradora | undefined;
  onSave: (geradora: UsinaGeradora) => void;
  onDelete: (geradora: UsinaGeradora) => void;
}

const EditarUsinaModal = ({ isOpen, onClose, geradora, onSave, onDelete }: EditarUsinaModalProps) => {
  const { toast } = useToast();
  
  // Dados da usina geradora
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [status, setStatus] = useState("ativo");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInstalacao, setDataInstalacao] = useState("");

  useEffect(() => {
    if (geradora) {
      setNome(geradora.nome || "");
      setPotencia(geradora.potencia || "");
      setLocalizacao(geradora.localizacao || "");
      setEndereco(geradora.endereco || "");
      setCnpj(geradora.cnpj || "");
      setStatus(geradora.status || "ativo");
      setMarcaInversor(geradora.marcaInversor || "");
      setApiKey(geradora.apiKey || "");
      setDescricao(geradora.descricao || "");
      setDataInstalacao(geradora.dataInstalacao || "");
    }
  }, [geradora]);

  const handleSave = () => {
    if (!geradora) return;
    
    // Validação básica
    if (!nome || !potencia || !localizacao) {
      toast({
        title: "Dados incompletos",
        description: "Nome, potência e localização são campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Construir objeto da usina atualizada
    const usinaAtualizada: UsinaGeradora = {
      ...geradora,
      nome,
      potencia,
      localizacao,
      endereco,
      cnpj,
      status,
      marcaInversor,
      apiKey,
      descricao,
      dataInstalacao,
    };

    onSave(usinaAtualizada);
    onClose();
  };

  const handleDelete = () => {
    if (!geradora) return;
    onDelete(geradora);
    onClose();
  };

  if (!geradora) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Usina Geradora</DialogTitle>
          <DialogDescription>
            Atualize as informações da usina geradora. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="tecnico">Dados Técnicos</TabsTrigger>
          </TabsList>
          
          {/* Aba: Dados Básicos */}
          <TabsContent value="dados" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome da Usina
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="localizacao" className="text-right">
                Cidade/Estado
              </Label>
              <Input
                id="localizacao"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco" className="text-right">
                Endereço Completo
              </Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="col-span-3 resize-none h-20"
              />
            </div>
          </TabsContent>
          
          {/* Aba: Dados Técnicos */}
          <TabsContent value="tecnico" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="potencia" className="text-right">
                Potência Instalada
              </Label>
              <Input
                id="potencia"
                value={potencia}
                onChange={(e) => setPotencia(e.target.value)}
                className="col-span-3"
                placeholder="Ex: 500 kWp"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataInstalacao" className="text-right">
                Data de Instalação
              </Label>
              <Input
                id="dataInstalacao"
                type="date"
                value={dataInstalacao}
                onChange={(e) => setDataInstalacao(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marcaInversor" className="text-right">
                Marca do Inversor
              </Label>
              <Select 
                value={marcaInversor} 
                onValueChange={setMarcaInversor}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fronius">Fronius</SelectItem>
                  <SelectItem value="solar-edge">SolarEdge</SelectItem>
                  <SelectItem value="growatt">Growatt</SelectItem>
                  <SelectItem value="huawei">Huawei</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                Chave da API
              </Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder="Chave para integração com o sistema do inversor"
              />
            </div>
            
            <div className="col-span-3 col-start-2 text-sm text-gray-500 mt-2">
              <p>A chave da API é utilizada para integração com o sistema do fabricante do inversor.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditarUsinaModal;
