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
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PixConfigModal from "@/components/configuracoes/PixConfigModal";
import ApiPagamentosConfigModal from "@/components/configuracoes/ApiPagamentosConfigModal";
import MonitoramentoConfigModal from "@/components/configuracoes/MonitoramentoConfigModal";
import ContabilConfigModal from "@/components/configuracoes/ContabilConfigModal";
import { db, doc, getDoc, setDoc, updateDoc, auth } from "@/lib/firebase";

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

interface PixConfig {
  banco: string;
  tipoChave: string;
  chave: string;
}

interface ApiConfig {
  apiKey: string;
  endpoint: string;
  modo: string;
}

interface MonitoramentoConfig {
  plataforma: string;
  apiKey: string;
  intervalo: string;
}

interface ContabilConfig {
  sistema: string;
  formato: string;
  endpoint: string;
}

const ConfiguracoesPage = () => {
  const { toast } = useToast();
  // Estados para controlar a abertura dos modais
  const [isPixConfigModalOpen, setIsPixConfigModalOpen] = useState(false);
  const [isApiConfigModalOpen, setIsApiConfigModalOpen] = useState(false);
  const [isMonitoramentoModalOpen, setIsMonitoramentoModalOpen] = useState(false);
  const [isContabilModalOpen, setIsContabilModalOpen] = useState(false);
  
  // Estados para armazenar os dados de configuração
  const [pixConfigData, setPixConfigData] = useState<PixConfig | null>(null);
  
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

  const [loading, setLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [monitoramentoConfig, setMonitoramentoConfig] = useState<MonitoramentoConfig | null>(null);
  const [contabilConfig, setContabilConfig] = useState<ContabilConfig | null>(null);

  // Carregar configurações do Firebase ao iniciar
  useEffect(() => {
    const loadConfigurations = async () => {
      if (!auth.currentUser) return;
      
      setLoading(true);
      try {
        const userId = auth.currentUser.uid;
        const configDocRef = doc(db, 'configuracoes', userId);
        const docSnap = await getDoc(configDocRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Carregar configurações gerais
          if (data.configGeral) {
            setConfigGeral(data.configGeral);
            localStorage.setItem('configGeral', JSON.stringify(data.configGeral));
          }
          
          // Carregar configurações de tarifas
          if (data.configTarifas) {
            setConfigTarifas(data.configTarifas);
            localStorage.setItem('configTarifas', JSON.stringify(data.configTarifas));
          }
          
          // Carregar configurações de notificações
          if (data.configNotificacoes) {
            setConfigNotificacoes(data.configNotificacoes);
            localStorage.setItem('configNotificacoes', JSON.stringify(data.configNotificacoes));
          }
          
          // Carregar configuração PIX
          if (data.pixConfig) {
            setPixConfigData(data.pixConfig);
            localStorage.setItem('pixConfig', JSON.stringify(data.pixConfig));
          }
          
          // Carregar outras configurações de integração
          if (data.apiConfig) {
            setApiConfig(data.apiConfig);
            localStorage.setItem('apiConfig', JSON.stringify(data.apiConfig));
          }
          
          if (data.monitoramentoConfig) {
            setMonitoramentoConfig(data.monitoramentoConfig);
            localStorage.setItem('monitoramentoConfig', JSON.stringify(data.monitoramentoConfig));
          }
          
          if (data.contabilConfig) {
            setContabilConfig(data.contabilConfig);
            localStorage.setItem('contabilConfig', JSON.stringify(data.contabilConfig));
          }
        } else {
          // Se não existir documento no Firebase, carregar do localStorage como fallback
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do Firebase:", error);
        // Em caso de erro, carregar do localStorage
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const loadFromLocalStorage = () => {
      // Carregar do localStorage como fallback
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
      
      // Carregar outras configurações de integração
      const loadedApiConfig = localStorage.getItem('apiConfig');
      if (loadedApiConfig) {
        setApiConfig(JSON.parse(loadedApiConfig));
      }
      
      const loadedMonitoramentoConfig = localStorage.getItem('monitoramentoConfig');
      if (loadedMonitoramentoConfig) {
        setMonitoramentoConfig(JSON.parse(loadedMonitoramentoConfig));
      }
      
      const loadedContabilConfig = localStorage.getItem('contabilConfig');
      if (loadedContabilConfig) {
        setContabilConfig(JSON.parse(loadedContabilConfig));
      }
    };
    
    loadConfigurations();
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

  // Função para salvar configurações no Firebase
  const saveToFirebase = async (configType: string, data: ConfiguracaoGeral | ConfiguracaoTarifas | ConfiguracaoNotificacoes | PixConfig | ApiConfig | MonitoramentoConfig | ContabilConfig) => {
    if (!auth.currentUser) {
      toast({
        title: "Erro ao salvar",
        description: "Você precisa estar autenticado para salvar configurações.",
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const configDocRef = doc(db, 'configuracoes', userId);
      
      // Verificar se o documento já existe
      const docSnap = await getDoc(configDocRef);
      
      if (docSnap.exists()) {
        // Atualizar documento existente
        await updateDoc(configDocRef, {
          [configType]: data,
          updatedAt: new Date()
        });
      } else {
        // Criar novo documento
        await setDoc(configDocRef, {
          [configType]: data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      // Salvar também no localStorage como backup
      localStorage.setItem(configType, JSON.stringify(data));
      
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${configType} no Firebase:`, error);
      
      // Salvar no localStorage mesmo em caso de erro
      localStorage.setItem(configType, JSON.stringify(data));
      
      toast({
        title: "Erro ao salvar no servidor",
        description: "As configurações foram salvas localmente, mas houve um erro ao salvar no servidor.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeral = async () => {
    const success = await saveToFirebase('configGeral', configGeral);
    
    toast({
      title: success ? "Configurações gerais salvas" : "Configurações salvas localmente",
      description: success 
        ? "As configurações gerais foram salvas com sucesso no servidor!" 
        : "As configurações foram salvas localmente.",
      variant: "default",
    });
  };

  const handleSaveTarifas = async () => {
    const success = await saveToFirebase('configTarifas', configTarifas);
    
    toast({
      title: success ? "Configurações de tarifas salvas" : "Configurações salvas localmente",
      description: success 
        ? "As configurações de tarifas foram salvas com sucesso no servidor!" 
        : "As configurações foram salvas localmente.",
      variant: "default",
    });
  };

  const handleSaveNotificacoes = async () => {
    const success = await saveToFirebase('configNotificacoes', configNotificacoes);
    
    toast({
      title: success ? "Configurações de notificações salvas" : "Configurações salvas localmente",
      description: success 
        ? "As configurações de notificações foram salvas com sucesso no servidor!" 
        : "As configurações foram salvas localmente.",
      variant: "default",
    });
  };

  const handleOpenPixConfig = () => {
    setIsPixConfigModalOpen(true);
  };

  const handleViewPixConfig = () => {
    if (pixConfigData) {
      toast({
        title: "Configuração PIX Atual",
        description: (
          <div className="mt-2 text-sm">
            <p><strong>Banco:</strong> {pixConfigData.banco || 'Não configurado'}</p>
            <p><strong>Tipo de Chave:</strong> {pixConfigData.tipoChave || 'Não configurado'}</p>
            <p><strong>Chave:</strong> {pixConfigData.chave || 'Não configurado'}</p>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({
        title: "Configuração PIX não encontrada",
        description: "Nenhuma configuração PIX salva ainda. Por favor, configure o PIX primeiro.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewApiConfig = () => {
    if (apiConfig) {
      toast({
        title: "Configuração da API de Pagamentos",
        description: (
          <div className="mt-2 text-sm">
            <p><strong>API Key:</strong> {apiConfig.apiKey || 'Não configurado'}</p>
            <p><strong>Endpoint:</strong> {apiConfig.endpoint || 'Não configurado'}</p>
            <p><strong>Modo:</strong> {apiConfig.modo || 'Não configurado'}</p>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({
        title: "Configuração da API não encontrada",
        description: "Nenhuma configuração da API de Pagamentos salva ainda. Por favor, configure primeiro.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewMonitoramentoConfig = () => {
    if (monitoramentoConfig) {
      toast({
        title: "Configuração de Monitoramento",
        description: (
          <div className="mt-2 text-sm">
            <p><strong>Plataforma:</strong> {monitoramentoConfig.plataforma || 'Não configurado'}</p>
            <p><strong>API Key:</strong> {monitoramentoConfig.apiKey || 'Não configurado'}</p>
            <p><strong>Intervalo de Sincronização:</strong> {monitoramentoConfig.intervalo || 'Não configurado'}</p>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({
        title: "Configuração de Monitoramento não encontrada",
        description: "Nenhuma configuração de Monitoramento salva ainda. Por favor, configure primeiro.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewContabilConfig = () => {
    if (contabilConfig) {
      toast({
        title: "Configuração de Exportação Contábil",
        description: (
          <div className="mt-2 text-sm">
            <p><strong>Sistema:</strong> {contabilConfig.sistema || 'Não configurado'}</p>
            <p><strong>Formato:</strong> {contabilConfig.formato || 'Não configurado'}</p>
            <p><strong>Endpoint:</strong> {contabilConfig.endpoint || 'Não configurado'}</p>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({
        title: "Configuração de Exportação Contábil não encontrada",
        description: "Nenhuma configuração de Exportação Contábil salva ainda. Por favor, configure primeiro.",
        variant: "destructive",
      });
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
                  <Button variant="outline" className="bg-white" onClick={handleViewPixConfig}>Visualizar</Button>
                  <Button variant="outline" onClick={handleOpenPixConfig}>Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">API de Pagamentos</h3>
                  <p className="text-sm text-muted-foreground">Integração para processamento de pagamentos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white" onClick={handleViewApiConfig}>Visualizar</Button>
                  <Button variant="outline" onClick={() => setIsApiConfigModalOpen(true)}>Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Monitoramento de Geração</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema de monitoramento solar</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white" onClick={handleViewMonitoramentoConfig}>Visualizar</Button>
                  <Button variant="outline" onClick={() => setIsMonitoramentoModalOpen(true)}>Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium">Exportação Contábil</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema contábil</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white" onClick={handleViewContabilConfig}>Visualizar</Button>
                  <Button variant="outline" onClick={() => setIsContabilModalOpen(true)}>Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais de configuração */}
      <PixConfigModal 
        isOpen={isPixConfigModalOpen} 
        onClose={() => setIsPixConfigModalOpen(false)} 
      />
      
      <ApiPagamentosConfigModal
        isOpen={isApiConfigModalOpen}
        onClose={() => setIsApiConfigModalOpen(false)}
      />
      
      <MonitoramentoConfigModal
        isOpen={isMonitoramentoModalOpen}
        onClose={() => setIsMonitoramentoModalOpen(false)}
      />
      
      <ContabilConfigModal
        isOpen={isContabilModalOpen}
        onClose={() => setIsContabilModalOpen(false)}
      />
    </div>
  );
};

export default ConfiguracoesPage;
