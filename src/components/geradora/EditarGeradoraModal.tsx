import React, { useState, useEffect, useRef } from "react";
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
import { Geradora } from "@/portal-admin/types";

interface EditarGeradoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: Geradora;
  onSave: (geradora: Geradora) => void;
  onDelete: (geradora: Geradora) => void;
}

const EditarGeradoraModal = ({ isOpen, onClose, geradora, onSave, onDelete }: EditarGeradoraModalProps) => {
  const { toast } = useToast();
  
  // Dados da geradora
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState<"ativo" | "bloqueado" | "pendente">("ativo");
  
  // Dados do responsável
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  
  // Dados do plano
  const [tipoPlano, setTipoPlano] = useState<"percentual" | "fixo" | "por_usuario" | "misto">("percentual");
  const [percentual, setPercentual] = useState<number | undefined>(undefined);
  const [valorFixo, setValorFixo] = useState<number | undefined>(undefined);
  const [valorPorUsuario, setValorPorUsuario] = useState<number | undefined>(undefined);
  const [limiteUsuarios, setLimiteUsuarios] = useState(10);
  
  // Dados de segurança
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [alterarSenha, setAlterarSenha] = useState(false);

  useEffect(() => {
    if (geradora) {
      // Dados da geradora
      setNome(geradora.nome || "");
      setEmail(geradora.email || "");
      setCnpj(geradora.cnpj || "");
      setEndereco(geradora.endereco || "");
      setStatus(geradora.status || "ativo");
      
      // Dados do responsável
      setResponsavel(geradora.responsavel || "");
      setTelefone(geradora.telefone || "");
      
      // Dados do plano
      setTipoPlano(geradora.planoCobranca?.tipo || "percentual");
      setPercentual(geradora.planoCobranca?.percentual);
      setValorFixo(geradora.planoCobranca?.valorFixo);
      setValorPorUsuario(geradora.planoCobranca?.valorPorUsuario);
      setLimiteUsuarios(geradora.limiteUsuarios || 10);
    }
  }, [geradora]);

  const handleSave = () => {
    // Validação básica
    if (!nome || !email) {
      toast({
        title: "Dados incompletos",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Construir objeto do plano de cobrança
    const planoCobranca = {
      tipo: tipoPlano,
      percentual: tipoPlano === "percentual" || tipoPlano === "misto" ? percentual : undefined,
      valorFixo: tipoPlano === "fixo" || tipoPlano === "misto" ? valorFixo : undefined,
      valorPorUsuario: tipoPlano === "por_usuario" || tipoPlano === "misto" ? valorPorUsuario : undefined,
    };

    // Validar senha se estiver alterando
    if (alterarSenha) {
      if (!novaSenha) {
        toast({
          title: "Senha em branco",
          description: "Por favor, informe uma nova senha.",
          variant: "destructive",
        });
        return;
      }
      
      if (novaSenha !== confirmarSenha) {
        toast({
          title: "Senhas não conferem",
          description: "A nova senha e a confirmação devem ser iguais.",
          variant: "destructive",
        });
        return;
      }
    }

    // Construir objeto da geradora atualizada
    const geradoraAtualizada: Geradora = {
      ...geradora,
      nome,
      email,
      cnpj,
      endereco,
      status,
      responsavel,
      telefone,
      planoCobranca,
      limiteUsuarios,
    };
    
    // Adicionar nova senha se estiver alterando
    if (alterarSenha) {
      geradoraAtualizada.senha = novaSenha;
    }

    onSave(geradoraAtualizada);
    onClose();
  };

  const handleDelete = () => {
    onDelete(geradora);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Geradora</DialogTitle>
          <DialogDescription>
            Atualize as informações da geradora. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="geradora" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geradora">Dados da Geradora</TabsTrigger>
            <TabsTrigger value="responsavel">Responsável</TabsTrigger>
            <TabsTrigger value="plano">Plano de Cobrança</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>
          
          {/* Aba: Dados da Geradora */}
          <TabsContent value="geradora" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <Label htmlFor="endereco" className="text-right">
                Endereço
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
                onValueChange={(value) => setStatus(value as "ativo" | "bloqueado" | "pendente")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          {/* Aba: Responsável */}
          <TabsContent value="responsavel" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsavel" className="text-right">
                Nome
              </Label>
              <Input
                id="responsavel"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </TabsContent>
          
          {/* Aba: Plano de Cobrança */}
          <TabsContent value="plano" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoPlano" className="text-right">
                Tipo de Plano
              </Label>
              <Select 
                value={tipoPlano} 
                onValueChange={(value) => setTipoPlano(value as "percentual" | "fixo" | "por_usuario" | "misto")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual">Percentual</SelectItem>
                  <SelectItem value="fixo">Valor Fixo</SelectItem>
                  <SelectItem value="por_usuario">Por Usuário</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(tipoPlano === "percentual" || tipoPlano === "misto") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="percentual" className="text-right">
                  Percentual (%)
                </Label>
                <Input
                  id="percentual"
                  type="number"
                  value={percentual || ""}
                  onChange={(e) => setPercentual(e.target.value ? Number(e.target.value) : undefined)}
                  className="col-span-3"
                />
              </div>
            )}
            
            {(tipoPlano === "fixo" || tipoPlano === "misto") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valorFixo" className="text-right">
                  Valor Fixo (R$)
                </Label>
                <Input
                  id="valorFixo"
                  type="number"
                  value={valorFixo || ""}
                  onChange={(e) => setValorFixo(e.target.value ? Number(e.target.value) : undefined)}
                  className="col-span-3"
                />
              </div>
            )}
            
            {(tipoPlano === "por_usuario" || tipoPlano === "misto") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valorPorUsuario" className="text-right">
                  Valor por Usuário (R$)
                </Label>
                <Input
                  id="valorPorUsuario"
                  type="number"
                  value={valorPorUsuario || ""}
                  onChange={(e) => setValorPorUsuario(e.target.value ? Number(e.target.value) : undefined)}
                  className="col-span-3"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limiteUsuarios" className="text-right">
                Limite de Usuários
              </Label>
              <Input
                id="limiteUsuarios"
                type="number"
                value={limiteUsuarios}
                onChange={(e) => setLimiteUsuarios(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </TabsContent>
          
          {/* Aba: Segurança */}
          <TabsContent value="seguranca" className="space-y-4 py-4">
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="alterarSenha"
                  checked={alterarSenha}
                  onChange={(e) => setAlterarSenha(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="alterarSenha">
                  Alterar senha da geradora
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Marque esta opção para definir uma nova senha para a geradora.
              </p>
            </div>
            
            {alterarSenha && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="novaSenha" className="text-right">
                    Nova Senha
                  </Label>
                  <Input
                    id="novaSenha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirmarSenha" className="text-right">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
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

export default EditarGeradoraModal;
