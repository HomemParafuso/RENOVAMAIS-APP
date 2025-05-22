
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

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
  onDelete?: (geradora: Geradora) => void;
}

const EditarGeradoraModal = ({ 
  isOpen, 
  onClose, 
  geradora,
  isViewOnly = false,
  onSave,
  onDelete
}: EditarGeradoraModalProps) => {
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("ativo");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  // Reset form fields when geradora changes or modal opens
  useEffect(() => {
    if (geradora) {
      setNome(geradora.nome);
      setPotencia(geradora.potencia);
      setLocalizacao(geradora.localizacao);
      setStatus(geradora.status);
      setMarcaInversor(geradora.marcaInversor || "");
      setApiKey(geradora.apiKey || "");
    }
  }, [geradora, isOpen]); // Added isOpen to the dependency array to ensure reset on modal open

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
      
      console.log("Salvando geradora atualizada:", geradoraAtualizada);
      onSave(geradoraAtualizada);
      
      toast({
        title: "Geradora atualizada",
        description: "As informações da geradora foram atualizadas com sucesso!",
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (geradora && onDelete) {
      onDelete(geradora);
      setShowDeleteAlert(false);
      onClose();
    }
  };

  return (
    <>
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
          
          <DialogFooter className="flex justify-between gap-3 mt-6">
            <div>
              {!isViewOnly && onDelete && (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Geradora
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
              {!isViewOnly && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvar}>
                  Salvar Alterações
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir esta geradora? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditarGeradoraModal;
