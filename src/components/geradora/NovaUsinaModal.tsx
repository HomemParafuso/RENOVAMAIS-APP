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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";

interface NovaUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradoraId: string;
  onSave: (usina: Omit<UsinaGeradora, 'id'>) => void;
}

const NovaUsinaModal = ({ isOpen, onClose, geradoraId, onSave }: NovaUsinaModalProps) => {
  const { toast } = useToast();
  
  // Dados da usina geradora
  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [codigoConsumidor, setCodigoConsumidor] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [descricao, setDescricao] = useState("");

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

    // Criar objeto da usina
    const novaUsina: Omit<UsinaGeradora, 'id'> = {
      nome,
      potencia: "", // Campo mantido vazio conforme solicitado
      localizacao,
      endereco,
      codigoConsumidor,
      email,
      cnpj,
      status: "ativo", // Valor padrão
      clientesVinculados: 0,
      marcaInversor: "", // Campo mantido vazio conforme solicitado
      apiKey: "", // Campo mantido vazio conforme solicitado
      descricao,
      dataInstalacao: "", // Campo mantido vazio conforme solicitado
      dataCadastro: new Date().toISOString(),
      geradoraId,
      senha: "" // A senha será definida pelo administrador posteriormente
    };

    console.log("Iniciando salvamento da usina", nome);
    
    // Chamar a função de callback para salvar
    onSave(novaUsina);
    
    // Limpar formulário
    limparFormulario();
    
    // Fechar o modal
    onClose();
  };

  const limparFormulario = () => {
    setNome("");
    setLocalizacao("");
    setEndereco("");
    setCodigoConsumidor("");
    setEmail("");
    setCnpj("");
    setDescricao("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Usina Geradora</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova usina geradora
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nome">Nome da Usina *</Label>
            <Input 
              id="nome" 
              placeholder="Ex: Usina Solar São Paulo I" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="codigoConsumidor">Código de Consumidor *</Label>
            <Input 
              id="codigoConsumidor" 
              placeholder="Código que consta no PDF de energia da concessionária" 
              value={codigoConsumidor}
              onChange={(e) => setCodigoConsumidor(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cnpj">CNPJ da Usina *</Label>
            <Input 
              id="cnpj" 
              placeholder="00.000.000/0000-00" 
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="localizacao">Cidade/Estado *</Label>
            <Input 
              id="localizacao" 
              placeholder="Ex: São Paulo, SP" 
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço Completo *</Label>
            <Input 
              id="endereco" 
              placeholder="Ex: Av. Paulista, 1000 - Bela Vista" 
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email de Acesso *</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="email@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              placeholder="Descreva detalhes sobre a usina geradora" 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="resize-none h-20"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleSalvar}
            type="button"
          >
            Cadastrar Usina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaUsinaModal;
