
import React, { useState, useEffect } from "react";
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

interface Geradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  status: string;
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
}

interface EditarGeradoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora?: Geradora;
  isViewOnly?: boolean;
  onSave?: (geradora: Geradora) => void;
}

const EditarGeradoraModal = ({ 
  isOpen, 
  onClose, 
  geradora,
  isViewOnly = false,
  onSave
}: EditarGeradoraModalProps) => {
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("ativo");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (geradora) {
      setNome(geradora.nome);
      setPotencia(geradora.potencia);
      setLocalizacao(geradora.localizacao);
      setStatus(geradora.status);
      setMarcaInversor(geradora.marcaInversor || "");
      setApiKey(geradora.apiKey || "");
    }
  }, [geradora]);

  const handleSalvar = () => {
    if (!nome || !potencia || !localizacao) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (geradora && onSave) {
      const geradoraAtualizada = {
        ...geradora,
        nome,
        potencia,
        localizacao,
        status,
        marcaInversor,
        apiKey
      };
      
      onSave(geradoraAtualizada);
    }

    toast({
      title: "Geradora atualizada",
      description: "As informações da geradora foram atualizadas com sucesso!",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isViewOnly ? "Detalhes da Geradora" : "Editar Geradora"}</DialogTitle>
          <DialogDescription>
            {isViewOnly ? "Visualize os detalhes da geradora" : "Edite as informações da unidade geradora"}
          </DialogDescription>
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
                readOnly={isViewOnly}
                className={isViewOnly ? "bg-gray-100" : ""}
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
                readOnly={isViewOnly}
                className={isViewOnly ? "bg-gray-100" : ""}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
                disabled={isViewOnly}
              >
                <SelectTrigger id="status" className={isViewOnly ? "bg-gray-100" : ""}>
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
              readOnly={isViewOnly}
              className={isViewOnly ? "bg-gray-100" : ""}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h4 className="font-medium mb-3">Configurações de Integração</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marcaInversor">Marca do Inversor</Label>
                <Select 
                  value={marcaInversor} 
                  onValueChange={setMarcaInversor}
                  disabled={isViewOnly}
                >
                  <SelectTrigger id="marcaInversor" className={isViewOnly ? "bg-gray-100" : ""}>
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
                  readOnly={isViewOnly}
                  className={isViewOnly ? "bg-gray-100" : ""}
                  type={isViewOnly ? "password" : "text"}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          {!isViewOnly && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvar}>
              Salvar Alterações
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditarGeradoraModal;
