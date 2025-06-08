import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PixConfigModal from "@/components/configuracoes/PixConfigModal";

interface ConfiguracaoGeral {
  nomeEmpresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
}

interface ConfiguracaoTarifas {
  tarifaUso: string;
  tarifaEnergia: string;
}

interface ConfiguracaoNotificacoes {
  emailRemetente: string;
  nomeRemetente: string;
  notificacaoAutomatica: boolean;
  templateFatura: string;
  templateLembrete: string;
  templateAtraso: string;
}

const ConfiguracoesPage = () => {
  const { toast } = useToast();
  const [isPixConfigModalOpen, setIsPixConfigModalOpen] = useState(false);
  const [pixConfigData, setPixConfigData] = useState<any | null>(null);
  
  // Estados para configurações
  const [configGeral, setConfigGeral] = useState<ConfiguracaoGeral>({
    nomeEmpresa: "Renova Mais Energia",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: ""
  });
  
  const [configTarifas, setConfigTarifas] = useState<ConfiguracaoTarifas>({
    tarifaUso: "",
    tarifaEnergia: ""
  });
  
  const [configNotificacoes, setConfigNotificacoes] = useState<ConfiguracaoNotificacoes>({
    emailRemetente: "",
    nomeRemetente: "Renova Mais Energia",
    notificacaoAutomatica: false,
    templateFatura: "",
    templateLembrete: "",
    templateAtraso: ""
  });

  // Carregar configurações do localStorage ao iniciar
  useEffect(() => {
    const loadedConfigGeral = localStorage.getItem('configGeral');
    if (loadedConfigGeral) {
      setConfigGeral(JSON.parse(loadedConfigGeral));
    }
    
    const loadedConfigTarifas = localStorage.getItem('configTarifas');
    if (loadedConfigTarifas) {
      setConfigTarifas(JSON.parse(loadedConfigTarifas));
    }
    
    const loadedConfigNotificacoes = localStorage.getItem('configNotificacoes');
    if (loadedConfigNotificacoes) {
      setConfigNotificacoes(JSON.parse(loadedConfigNotificacoes));
    }
    
    // Carregar configuração PIX ao iniciar
    const loadedPixConfig = localStorage.getItem('pixConfig');
    if (loadedPixConfig) {
      setPixConfigData(JSON.parse(loadedPixConfig));
    }
  }, []);

  const handleInputChangeGeral = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setConfigGeral(prev => ({ ...prev, [id]: value }));
  };

  const handleInputChangeTarifas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setConfigTarifas(prev => ({ ...prev, [id]: value }));
  };

  const handleInputChangeNotificacoes = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setConfigNotificacoes(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChangeNotificacoes = (checked: boolean) => {
    setConfigNotificacoes(prev => ({ ...prev, notificacaoAutomatica: checked }));
  };

  const handleSaveGeral = () => {
    localStorage.setItem('configGeral', JSON.stringify(configGeral));
    toast({
      title: "Configurações gerais salvas",
      description: "As configurações gerais foram salvas com sucesso!",
    });
  };

  const handleSaveTarifas = () => {
    localStorage.setItem('configTarifas', JSON.stringify(configTarifas));
    toast({
      title: "Configurações de tarifas salvas",
      description: "As configurações de tarifas foram salvas com sucesso!",
    });
  };

  const handleSaveNotificacoes = () => {
    localStorage.setItem('configNotificacoes', JSON.stringify(configNotificacoes));
    toast({
      title: "Configurações de notificações salvas",
      description: "As configurações de notificações foram salvas com sucesso!",
    });
  };

  const handleOpenPixConfig = () => {
    setIsPixConfigModalOpen(true);
  };

  const handleViewPixConfig = () => {
    const loadedPixConfig = localStorage.getItem('pixConfig');
    if (loadedPixConfig) {
      const config = JSON.parse(loadedPixConfig);
      setPixConfigData(config);
      toast({
        title: "Configuração PIX Atual",
        description: (
          <div className="mt-2 text-sm">
            <p><strong>Banco:</strong> {config.banco || 'Não configurado'}</p>
            <p><strong>Tipo de Chave:</strong> {config.tipoChave || 'Não configurado'}</p>
            <p><strong>Chave:</strong> {config.chave || 'Não configurado'}</p>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({
        title: "Configuração PIX não encontrada",
        description: "Nenhuma configuração PIX salva ainda. Por favor, configure o PIX primeiro.",
        variant: "warning",
      });
      setPixConfigData(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Personalize as configurações do seu sistema</p>
        </div>
      </div>

      <Tabs defaultValue="geral">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="tarifas">Tarifas e Cálculos</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure os dados básicos da sua empresa para exibição em faturas e relatórios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input 
                  id="nomeEmpresa" 
                  placeholder="Nome da sua empresa" 
                  value={configGeral.nomeEmpresa}
                  onChange={handleInputChangeGeral}
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj" 
                  placeholder="CNPJ da empresa" 
                  value={configGeral.cnpj}
                  onChange={handleInputChangeGeral}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="Telefone para contato" 
                    value={configGeral.telefone}
                    onChange={handleInputChangeGeral}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email para contato" 
                    value={configGeral.email}
                    onChange={handleInputChangeGeral}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  id="endereco" 
                  placeholder="Endereço completo" 
                  value={configGeral.endereco}
                  onChange={handleInputChangeGeral}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveGeral}>
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarifas">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Tarifas</CardTitle>
              <CardDescription>
                Configure as tarifas padrão que serão utilizadas nos cálculos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tarifaUso">Tarifa de Uso (TU)</Label>
                  <Input 
                    id="tarifaUso" 
                    type="number" 
                    placeholder="0.00" 
                    value={configTarifas.tarifaUso}
                    onChange={handleInputChangeTarifas}
                  />
                </div>
                <div>
                  <Label htmlFor="tarifaEnergia">Tarifa de Energia (TE)</Label>
                  <Input 
                    id="tarifaEnergia" 
                    type="number" 
                    placeholder="0.00" 
                    value={configTarifas.tarifaEnergia}
                    onChange={handleInputChangeTarifas}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveTarifas}>
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>
                Configure como os emails serão enviados para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailRemetente">Email do Remetente</Label>
                  <Input 
                    id="emailRemetente" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={configNotificacoes.emailRemetente}
                    onChange={handleInputChangeNotificacoes}
                  />
                </div>
                <div>
                  <Label htmlFor="nomeRemetente">Nome do Remetente</Label>
                  <Input 
                    id="nomeRemetente" 
                    placeholder="Nome da Empresa" 
                    value={configNotificacoes.nomeRemetente}
                    onChange={handleInputChangeNotificacoes}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notificacaoAutomatica" 
                  checked={configNotificacoes.notificacaoAutomatica}
                  onCheckedChange={handleSwitchChangeNotificacoes}
                />
                <Label htmlFor="notificacaoAutomatica">Enviar notificações automáticas</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Templates de Mensagens</CardTitle>
              <CardDescription>
                Personalize as mensagens enviadas aos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="templateFatura">Template para Novas Faturas</Label>
                <Textarea 
                  id="templateFatura" 
                  placeholder="Olá {nome}, sua fatura no valor de {valor} está disponível..."
                  className="min-h-[100px]"
                  value={configNotificacoes.templateFatura}
                  onChange={handleInputChangeNotificacoes}
                />
              </div>
              <div>
                <Label htmlFor="templateLembrete">Template para Lembrete de Vencimento</Label>
                <Textarea 
                  id="templateLembrete" 
                  placeholder="Olá {nome}, lembre-se que sua fatura vence em {dias} dias..."
                  className="min-h-[100px]"
                  value={configNotificacoes.templateLembrete}
                  onChange={handleInputChangeNotificacoes}
                />
              </div>
              <div>
                <Label htmlFor="templateAtraso">Template para Lembrete de Atraso</Label>
                <Textarea 
                  id="templateAtraso" 
                  placeholder="Olá {nome}, sua fatura no valor de {valor} está atrasada há {dias} dias..."
                  className="min-h-[100px]"
                  value={configNotificacoes.templateAtraso}
                  onChange={handleInputChangeNotificacoes}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveNotificacoes}>
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracao">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Configure integrações com outros sistemas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Configurar PIX</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema de pagamentos PIX</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleViewPixConfig}>Ver Configuração</Button>
                  <Button variant="outline" onClick={handleOpenPixConfig}>Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">API de Pagamentos</h3>
                  <p className="text-sm text-muted-foreground">Integração para processamento de pagamentos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toast({ title: "Funcionalidade em desenvolvimento", description: "A visualização da configuração da API de Pagamentos será implementada em breve." })}>Ver Configuração</Button>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Monitoramento de Geração</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema de monitoramento solar</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toast({ title: "Funcionalidade em desenvolvimento", description: "A visualização da configuração de Monitoramento de Geração será implementada em breve." })}>Ver Configuração</Button>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium">Exportação Contábil</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema contábil</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toast({ title: "Funcionalidade em desenvolvimento", description: "A visualização da configuração de Exportação Contábil será implementada em breve." })}>Ver Configuração</Button>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PixConfigModal 
        isOpen={isPixConfigModalOpen} 
        onClose={() => setIsPixConfigModalOpen(false)} 
      />
    </div>
  );
};

export default ConfiguracoesPage;
