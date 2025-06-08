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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface EditarUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: UsinaGeradora;
  onSave: (usina: UsinaGeradora) => void;
  onDelete: (usina: UsinaGeradora) => void;
  isViewOnly?: boolean;
}

const EditarUsinaModal = ({ isOpen, onClose, geradora, onSave, onDelete, isViewOnly = false }: EditarUsinaModalProps) => {
  const { toast } = useToast();
  
  // Dados da usina geradora
  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [codigoConsumidor, setCodigoConsumidor] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [descricao, setDescricao] = useState("");
  
  // Estado para o diálogo de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Carregar dados da usina quando o modal for aberto
  useEffect(() => {
    if (geradora) {
      setNome(geradora.nome || "");
      setLocalizacao(geradora.localizacao || "");
      setEndereco(geradora.endereco || "");
      setCodigoConsumidor(geradora.codigoConsumidor || "");
      setEmail(geradora.email || "");
      setCnpj(geradora.cnpj || "");
      setDescricao(geradora.descricao || "");
    }
  }, [geradora, isOpen]);

  const handleSalvar = () => {
    // Validação dos campos obrigatórios
    if (!nome || !localizacao || !endereco || !codigoConsumidor || !email || !cnpj) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios da usina geradora.",
        variant: "destructive"
      });
      return;
    }

    // Criar objeto da usina atualizada
    const usinaAtualizada: UsinaGeradora = {
      ...geradora,
      nome,
      localizacao,
      endereco,
      codigoConsumidor,
      email,
      cnpj,
      descricao
    };

    console.log("Atualizando usina:", nome);
    
    // Chamar a função de callback para salvar
    onSave(usinaAtualizada);
    
    // Fechar o modal
    onClose();
  };

  const handleExcluir = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmarExclusao = () => {
    onDelete(geradora);
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isViewOnly ? "Detalhes da Usina Geradora" : "Editar Usina Geradora"}</DialogTitle>
            <DialogDescription>
              {isViewOnly ? "Visualize os dados da usina geradora" : "Atualize os dados da usina geradora"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="nome">Nome da Usina *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{nome}</div>
              ) : (
                <Input 
                  id="nome" 
                  placeholder="Ex: Usina Solar São Paulo I" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="codigoConsumidor">Código de Consumidor *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{codigoConsumidor}</div>
              ) : (
                <Input 
                  id="codigoConsumidor" 
                  placeholder="Código que consta no PDF de energia da concessionária" 
                  value={codigoConsumidor}
                  onChange={(e) => setCodigoConsumidor(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="cnpj">CNPJ da Usina *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{cnpj}</div>
              ) : (
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0000-00" 
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="localizacao">Cidade/Estado *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{localizacao}</div>
              ) : (
                <Input 
                  id="localizacao" 
                  placeholder="Ex: São Paulo, SP" 
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço Completo *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{endereco}</div>
              ) : (
                <Input 
                  id="endereco" 
                  placeholder="Ex: Av. Paulista, 1000 - Bela Vista" 
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email de Acesso *</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800">{email}</div>
              ) : (
                <Input 
                  id="email" 
                  type="email"
                  placeholder="email@exemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              {isViewOnly ? (
                <div className="p-2 bg-gray-100 rounded-md text-gray-800 min-h-[80px]">{descricao || "Nenhuma descrição."}</div>
              ) : (
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva detalhes sobre a usina geradora" 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="resize-none h-20"
                />
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between gap-3 mt-6">
            {!isViewOnly && (
              <Button 
                variant="destructive" 
                onClick={handleExcluir}
                type="button"
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
            
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant="outline">{isViewOnly ? "Fechar" : "Cancelar"}</Button>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta usina?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a usina {geradora?.nome || "selecionada"} do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditarUsinaModal;
