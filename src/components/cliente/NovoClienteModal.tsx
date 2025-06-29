import React, { useState, useEffect } from "react";
import { clienteService } from "@/services/clienteService";
import { usinaService } from "@/services/usinaService";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const NovoClienteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoCalculo, setTipoCalculo] = useState("percentual");
  const [percentualEconomia, setPercentualEconomia] = useState("");
  const [fonteTarifa, setFonteTarifa] = useState("global");
  const [tusd, setTusd] = useState("");
  const [te, setTe] = useState("");
  const [tipoIluminacao, setTipoIluminacao] = useState("fixo");
  const [valorFixo, setValorFixo] = useState("");
  const [valorPercentual, setValorPercentual] = useState("");
  const [activeTab, setActiveTab] = useState("informacoes");
  const [usinas, setUsinas] = useState<UsinaGeradora[]>([]);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Obter o ID da geradora do usuário logado (simulado por enquanto)
  const geradoraId = "geradora-123"; // Substituir pelo ID real da geradora logada
  
  // Carregar usinas da geradora
  useEffect(() => {
    const carregarUsinas = async () => {
      setLoading(true);
      try {
        const usinasData = await usinaService.getUsinasByGeradoraId(geradoraId);
        setUsinas(usinasData);
        if (usinasData.length > 0) {
          setSelectedUsinaId(usinasData[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar usinas:", error);
        toast({
          title: "Erro ao carregar usinas",
          description: "Não foi possível carregar a lista de usinas. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarUsinas();
  }, []);

  const handleSalvar = async () => {
    // Validação obrigatória dos campos pessoais
    if (!nome.trim() || !email.trim() || !cpfCnpj.trim() || !telefone.trim()) {
      toast({
        title: "Erro de validação",
        description: "Todos os campos de informações pessoais são obrigatórios!",
        variant: "destructive",
      });
      return;
    }

      // Criar objeto do cliente
      const novoCliente = {
        id: Date.now(), // ID temporário baseado em timestamp
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpfCnpj.trim(),
        telefone: telefone.trim(),
        tipoCalculo: tipoCalculo === "percentual" ? "Percentual de Economia" : "Valor Fixo",
        percentualEconomia: tipoCalculo === "percentual" ? parseFloat(percentualEconomia) || 0 : 0,
        fonteTarifa,
        tusd: fonteTarifa === "customizada" ? parseFloat(tusd) || 0 : 0,
        te: fonteTarifa === "customizada" ? parseFloat(te) || 0 : 0,
        tipoIluminacao,
        valorIluminacaoFixo: tipoIluminacao === "fixo" ? parseFloat(valorFixo) || 0 : 0,
        valorIluminacaoPercentual: tipoIluminacao === "percentual" ? parseFloat(valorPercentual) || 0 : 0,
        status: "ativo",
        usina: "", // Não mostrar usina até que seja vinculado
        usinaId: null, // Inicialmente não vinculado a nenhuma usina
        dataAdesao: new Date().toLocaleDateString('pt-BR'),
        dataCriacao: new Date().toISOString()
      };

    try {
      // Salvar no Firebase através do serviço
      const clienteSalvo = await clienteService.create({
        nome: nome.trim(),
        email: email.trim(),
        cpfCnpj: cpfCnpj.trim(),
        telefone: telefone.trim(),
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        status: "ativo",
        geradoraId: geradoraId,
        usinaId: null, // Inicialmente não vinculado a nenhuma usina
        dataCadastro: new Date().toISOString(),
        consumoMedio: 0,
        valorMedio: 0,
        observacoes: ""
      });

      console.log('Cliente salvo no Firebase:', clienteSalvo);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o cliente. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    // Limpar formulário
    setNome("");
    setEmail("");
    setCpfCnpj("");
    setTelefone("");
    setTipoCalculo("percentual");
    setPercentualEconomia("");
    setFonteTarifa("global");
    setTusd("");
    setTe("");
    setTipoIluminacao("fixo");
    setValorFixo("");
    setValorPercentual("");
    setActiveTab("informacoes");

    toast({
      title: "Cliente criado",
      description: "O cliente foi cadastrado com sucesso!",
    });
    onClose();
  };

  const handleEnviarConvite = () => {
    toast({
      title: "Convite enviado",
      description: "Um e-mail de convite foi enviado para o cliente!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="informacoes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value="imoveis">
              Imóveis Vinculados
            </TabsTrigger>
            <TabsTrigger value="acesso">
              Liberação de Acesso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informacoes" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input 
                  id="nome" 
                  placeholder="Nome do cliente" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input 
                  id="cpfCnpj" 
                  placeholder="CPF ou CNPJ" 
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input 
                  id="telefone" 
                  placeholder="(00) 00000-0000" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Removido o seletor de usina do cadastro inicial */}

            <div className="border-t pt-4 mt-6">
              <h4 className="font-medium mb-3">Configuração de Cálculo</h4>
              
              <div className="mb-4">
                <Label htmlFor="tipoCalculo" className="mb-2 block">Tipo de Cálculo</Label>
                <Select value={tipoCalculo} onValueChange={setTipoCalculo}>
                  <SelectTrigger id="tipoCalculo">
                    <SelectValue placeholder="Selecione o tipo de cálculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual de Economia</SelectItem>
                    <SelectItem value="fixo">Valor Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoCalculo === "percentual" && (
                <div className="mb-4">
                  <Label htmlFor="percentualEconomia" className="mb-2 block">Percentual de Economia (%)</Label>
                  <Input 
                    id="percentualEconomia" 
                    type="number" 
                    placeholder="10" 
                    value={percentualEconomia}
                    onChange={(e) => setPercentualEconomia(e.target.value)}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <Label htmlFor="fonteTarifa" className="mb-2 block">Fonte da Tarifa (TU e TE)</Label>
                <Select value={fonteTarifa} onValueChange={setFonteTarifa}>
                  <SelectTrigger id="fonteTarifa">
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="customizada">Customizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fonteTarifa === "customizada" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="tusd" className="mb-2 block">TUSD (R$)</Label>
                    <Input 
                      id="tusd" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={tusd}
                      onChange={(e) => setTusd(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="te" className="mb-2 block">TE (R$)</Label>
                    <Input 
                      id="te" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={te}
                      onChange={(e) => setTe(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label>Tipo de Iluminação Pública</Label>
                <RadioGroup value={tipoIluminacao} onValueChange={setTipoIluminacao} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixo" id="fixo" />
                    <Label htmlFor="fixo">Valor Fixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentual" id="percentual" />
                    <Label htmlFor="percentual">Percentual da Tarifa</Label>
                  </div>
                </RadioGroup>
              </div>

              {tipoIluminacao === "fixo" ? (
                <div className="mt-4">
                  <Label htmlFor="valorFixo" className="mb-2 block">Valor Fixo Iluminação (R$)</Label>
                  <Input 
                    id="valorFixo" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={valorFixo}
                    onChange={(e) => setValorFixo(e.target.value)}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <Label htmlFor="valorPercentual" className="mb-2 block">Valor Percentual da Tarifa TU+TE (%)</Label>
                  <Input 
                    id="valorPercentual" 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    value={valorPercentual}
                    onChange={(e) => setValorPercentual(e.target.value)}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="imoveis" className="pt-4">
            <div className="mb-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <span className="mr-2">+</span>
                Adicionar Imóvel
              </Button>
            </div>

            <div className="bg-white rounded-md border">
              <div className="grid grid-cols-4 px-6 py-3 border-b text-sm font-medium text-gray-500">
                <div>Endereço</div>
                <div>Código Concessionária</div>
                <div>Distribuidora</div>
                <div className="text-right">Ações</div>
              </div>

              <div className="text-center py-6 text-gray-500">
                Nenhum imóvel vinculado a este cliente.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="acesso" className="space-y-4 pt-4">
            <p className="text-sm text-gray-600">
              O cliente receberá um e-mail com instruções para acessar o sistema. No primeiro acesso, ele precisará cadastrar uma senha.
            </p>

            <div>
              <Label htmlFor="emailAcesso">E-mail para Acesso</Label>
              <Input 
                id="emailAcesso" 
                type="email" 
                placeholder="email@exemplo.com" 
                className="mt-1" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 mt-2" 
              onClick={handleEnviarConvite}
            >
              Enviar Convite de Acesso
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvar}>
            Salvar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoClienteModal;
