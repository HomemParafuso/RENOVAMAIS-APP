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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Geradora, PlanoCobranca } from "@/portal-admin/types";
import { Textarea } from "@/components/ui/textarea";

interface NovaGeradoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (geradora: any) => void;
  geradoras: { nome: string }[];
  isPortalGeradora?: boolean;
}

const NovaGeradoraModal = ({ isOpen, onClose, onSave, geradoras, isPortalGeradora = false }: NovaGeradoraModalProps) => {
  // Dados do proprietário (usado apenas quando não é o portal da geradora)
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [emailResponsavel, setEmailResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  // Dados da usina geradora
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState("ativo");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [cnpjUsina, setCnpjUsina] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInstalacao, setDataInstalacao] = useState("");
  
  const { toast } = useToast();

  const handleSalvar = () => {
    console.log("Iniciando salvamento da geradora");
    
    if (isPortalGeradora) {
      // Validação para o portal da geradora (cadastro de usina)
      if (!nome || !potencia || !localizacao || !endereco || !cnpjUsina) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha todos os campos obrigatórios da usina geradora.",
          variant: "destructive"
        });
        console.log("Validação falhou: campos obrigatórios não preenchidos");
        return;
      }

      // Verificar se o nome já existe
      if (geradoras.some(geradora => geradora.nome.toLowerCase() === nome.toLowerCase())) {
        toast({
          title: "Nome já existe",
          description: "Já existe uma usina geradora com este nome. Por favor, escolha um nome diferente.",
          variant: "destructive"
        });
        console.log("Validação falhou: nome já existe");
        return;
      }

      // Criar objeto da nova usina geradora
      const novaUsina = {
        id: Date.now(), // ID temporário
        nome,
        potencia,
        localizacao,
        endereco,
        cnpj: cnpjUsina,
        status,
        clientesVinculados: 0,
        marcaInversor,
        apiKey,
        descricao,
        dataInstalacao: dataInstalacao || new Date().toISOString().split('T')[0],
        dataCadastro: new Date().toISOString()
      };

      console.log("Objeto da usina geradora criado:", novaUsina);
      
      // Chamar a função de callback para salvar
      try {
        onSave(novaUsina);
        console.log("Função onSave chamada com sucesso");
      } catch (error) {
        console.error("Erro ao chamar onSave:", error);
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar a usina geradora.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Usina geradora cadastrada",
        description: "A usina geradora foi cadastrada com sucesso!",
      });
    } else {
      // Validação para o portal do admin (cadastro de proprietário)
      if (!nomeResponsavel || !emailResponsavel || !telefoneResponsavel || !cnpj || !senha) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha todos os campos obrigatórios do proprietário.",
          variant: "destructive"
        });
        console.log("Validação falhou: campos obrigatórios não preenchidos");
        return;
      }

      // Validar senha
      if (senha !== confirmarSenha) {
        toast({
          title: "Senhas não conferem",
          description: "A senha e a confirmação de senha devem ser iguais.",
          variant: "destructive"
        });
        console.log("Validação falhou: senhas não conferem");
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailResponsavel)) {
        toast({
          title: "Email inválido",
          description: "Por favor, insira um endereço de email válido.",
          variant: "destructive"
        });
        console.log("Validação falhou: email inválido");
        return;
      }

      // Verificar se o nome já existe
      const nomeGeradora = `Geradora de ${nomeResponsavel}`;
      if (geradoras.some(geradora => geradora.nome.toLowerCase() === nomeGeradora.toLowerCase())) {
        toast({
          title: "Nome já existe",
          description: "Já existe uma geradora com este nome. Por favor, escolha um nome diferente.",
          variant: "destructive"
        });
        console.log("Validação falhou: nome já existe");
        return;
      }

      // Criar objeto da nova geradora com dados do proprietário
      const novaGeradora: Partial<Geradora> & { senha: string } = {
        nome: nomeGeradora,
        email: emailResponsavel,
        responsavel: nomeResponsavel,
        telefone: telefoneResponsavel,
        cnpj,
        senha, // Será usado para criar o usuário no Firebase
        status: 'ativo',
        dataCadastro: new Date().toISOString(),
        limiteUsuarios: 50, // Valor padrão
        usuariosAtivos: 0,
        planoCobranca: {
          tipo: 'percentual',
          percentual: 10
        } as PlanoCobranca
      };

      console.log("Objeto da geradora criado:", novaGeradora);
      
      // Chamar a função de callback para salvar
      try {
        onSave(novaGeradora);
        console.log("Função onSave chamada com sucesso");
      } catch (error) {
        console.error("Erro ao chamar onSave:", error);
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar a geradora.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Geradora cadastrada",
        description: "A geradora foi cadastrada com sucesso! O proprietário receberá um email com instruções de acesso.",
      });
    }
    
    // Reset form
    setNomeResponsavel("");
    setEmailResponsavel("");
    setTelefoneResponsavel("");
    setCnpj("");
    setSenha("");
    setConfirmarSenha("");
    setNome("");
    setPotencia("");
    setLocalizacao("");
    setEndereco("");
    setStatus("ativo");
    setMarcaInversor("");
    setApiKey("");
    setCnpjUsina("");
    setDescricao("");
    setDataInstalacao("");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isPortalGeradora ? "Nova Usina Geradora" : "Nova Geradora"}
          </DialogTitle>
          <DialogDescription>
            {isPortalGeradora 
              ? "Cadastre uma nova usina geradora de energia solar" 
              : "Cadastre o proprietário da geradora"}
          </DialogDescription>
        </DialogHeader>
        
        {isPortalGeradora ? (
          // Formulário para o portal da geradora (cadastro de usina)
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="potencia">Potência Instalada *</Label>
                <Input 
                  id="potencia" 
                  placeholder="Ex: 500 kWp" 
                  value={potencia}
                  onChange={(e) => setPotencia(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataInstalacao">Data de Instalação</Label>
                <Input 
                  id="dataInstalacao" 
                  type="date"
                  value={dataInstalacao}
                  onChange={(e) => setDataInstalacao(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cnpjUsina">CNPJ da Usina *</Label>
              <Input 
                id="cnpjUsina" 
                placeholder="00.000.000/0000-00" 
                value={cnpjUsina}
                onChange={(e) => setCnpjUsina(e.target.value)}
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
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descreva detalhes sobre a usina geradora" 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="resize-none h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <div>
              <Label htmlFor="apiKey">Chave da API (para integração)</Label>
              <Input 
                id="apiKey" 
                placeholder="Insira a chave da API do inversor" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Opcional. Utilizada para integração com o sistema do fabricante do inversor.</p>
            </div>
          </div>
        ) : (
          // Formulário para o portal do admin (cadastro de proprietário)
          <Tabs defaultValue="proprietario" className="mt-4">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="proprietario">Dados do Proprietário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proprietario" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
                  <Input 
                    id="nomeResponsavel" 
                    placeholder="Nome completo do responsável" 
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailResponsavel">Email do Responsável *</Label>
                  <Input 
                    id="emailResponsavel" 
                    type="email"
                    placeholder="email@exemplo.com" 
                    value={emailResponsavel}
                    onChange={(e) => setEmailResponsavel(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Será usado para login no sistema</p>
                </div>
                <div>
                  <Label htmlFor="telefoneResponsavel">Telefone *</Label>
                  <Input 
                    id="telefoneResponsavel" 
                    placeholder="(00) 00000-0000" 
                    value={telefoneResponsavel}
                    onChange={(e) => setTelefoneResponsavel(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cnpj">CNPJ da Empresa *</Label>
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0000-00" 
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senha">Senha *</Label>
                  <Input 
                    id="senha" 
                    type="password"
                    placeholder="Digite a senha" 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input 
                    id="confirmarSenha" 
                    type="password"
                    placeholder="Confirme a senha" 
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleSalvar}
            type="button"
          >
            {isPortalGeradora ? "Cadastrar Usina" : "Cadastrar Geradora"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaGeradoraModal;
