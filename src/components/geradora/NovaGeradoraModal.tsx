
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface NovaGeradoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (geradora: any) => void;
}

const NovaGeradoraModal = ({ isOpen, onClose, onSave }: NovaGeradoraModalProps) => {
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("ativo");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSalvar = () => {
    if (!nome || !potencia || !localizacao) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Criar objeto da nova geradora
    const novaGeradora = {
      id: Date.now(), // ID temporário baseado em timestamp
      nome,
      potencia,
      localizacao,
      status,
      clientesVinculados: 0,
      marcaInversor,
      apiKey
    };

    // Chamar a função de callback para salvar
    onSave(novaGeradora);
    
    toast({
      title: "Geradora cadastrada",
      description: "A geradora foi cadastrada com sucesso!",
    });
    
    // Reset form
    setNome("");
    setPotencia("");
    setLocalizacao("");
    setStatus("ativo");
    setMarcaInversor("");
    setApiKey("");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Geradora</DialogTitle>
          <DialogDescription>Preencha os dados da nova unidade geradora</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Geradora</Label>
              <Input 
                id="nome" 
                placeholder="Ex: Usina Solar São Paulo I" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="potencia">Potência</Label>
              <Input 
                id="potencia" 
                placeholder="Ex: 500 kWp" 
                value={potencia}
                onChange={(e) => setPotencia(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="localizacao">Localização</Label>
            <Input 
              id="localizacao" 
              placeholder="Ex: São Paulo, SP" 
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h4 className="font-medium mb-3">Configurações de Integração</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marcaInversor">Marca do Inversor</Label>
                <Select value={marcaInversor} onValueChange={setMarcaInversor}>
                  <SelectTrigger id="marcaInversor">
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
              <div>
                <Label htmlFor="apiKey">Chave da API</Label>
                <Input 
                  id="apiKey" 
                  placeholder="Insira a chave da API" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvar}>
            Salvar Geradora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaGeradoraModal;
