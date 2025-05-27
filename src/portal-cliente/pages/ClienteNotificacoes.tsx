
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, Trash2, AlertCircle, FileText, Zap } from "lucide-react";

const ClienteNotificacoes = () => {
  const [configuracoes, setConfiguracoes] = useState({
    emailFaturas: true,
    emailVencimentos: true,
    emailProducao: false,
    pushFaturas: true,
    pushVencimentos: true,
    pushProducao: true,
  });

  const notificacoes = [
    {
      id: 1,
      tipo: 'fatura',
      titulo: 'Nova fatura disponível',
      mensagem: 'Sua fatura de Maio/2025 está disponível para pagamento.',
      data: '15/05/2025 14:30',
      lida: false,
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      tipo: 'vencimento',
      titulo: 'Fatura vence em 3 dias',
      mensagem: 'Sua fatura de Maio/2025 no valor de R$ 170,00 vence em 15/06/2025.',
      data: '12/06/2025 09:00',
      lida: false,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      id: 3,
      tipo: 'producao',
      titulo: 'Produção acima da média',
      mensagem: 'Sua usina solar produziu 15% mais energia que o esperado este mês.',
      data: '10/06/2025 16:45',
      lida: true,
      icon: Zap,
      color: 'green'
    },
    {
      id: 4,
      tipo: 'pagamento',
      titulo: 'Pagamento confirmado',
      mensagem: 'Pagamento da fatura de Abril/2025 foi confirmado com sucesso.',
      data: '10/05/2025 11:20',
      lida: true,
      icon: Check,
      color: 'green'
    },
    {
      id: 5,
      tipo: 'sistema',
      titulo: 'Atualização do sistema',
      mensagem: 'O portal do cliente foi atualizado com novas funcionalidades.',
      data: '05/05/2025 08:00',
      lida: true,
      icon: Bell,
      color: 'gray'
    }
  ];

  const [notificacoesList, setNotificacoesList] = useState(notificacoes);

  const marcarComoLida = (id: number) => {
    setNotificacoesList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  const excluirNotificacao = (id: number) => {
    setNotificacoesList(prev => prev.filter(notif => notif.id !== id));
  };

  const marcarTodasComoLidas = () => {
    setNotificacoesList(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
  };

  const handleConfigChange = (key: string, value: boolean) => {
    setConfiguracoes(prev => ({ ...prev, [key]: value }));
  };

  const notificacaoNaoLidas = notificacoesList.filter(n => !n.lida).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie suas notificações e preferências de comunicação
          </p>
        </div>
        <div className="flex gap-2">
          {notificacaoNaoLidas > 0 && (
            <Button variant="outline" onClick={marcarTodasComoLidas}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Configurações de Notificação */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Notificações por Email</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novas faturas</p>
                    <p className="text-sm text-gray-500">Receber email quando uma nova fatura estiver disponível</p>
                  </div>
                  <Switch 
                    checked={configuracoes.emailFaturas}
                    onCheckedChange={(checked) => handleConfigChange('emailFaturas', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lembretes de vencimento</p>
                    <p className="text-sm text-gray-500">Receber lembrete 3 dias antes do vencimento</p>
                  </div>
                  <Switch 
                    checked={configuracoes.emailVencimentos}
                    onCheckedChange={(checked) => handleConfigChange('emailVencimentos', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relatórios de produção</p>
                    <p className="text-sm text-gray-500">Relatório mensal de produção de energia</p>
                  </div>
                  <Switch 
                    checked={configuracoes.emailProducao}
                    onCheckedChange={(checked) => handleConfigChange('emailProducao', checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Notificações Push</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novas faturas</p>
                    <p className="text-sm text-gray-500">Notificação instantânea no aplicativo</p>
                  </div>
                  <Switch 
                    checked={configuracoes.pushFaturas}
                    onCheckedChange={(checked) => handleConfigChange('pushFaturas', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lembretes de vencimento</p>
                    <p className="text-sm text-gray-500">Notificação 3 dias antes do vencimento</p>
                  </div>
                  <Switch 
                    checked={configuracoes.pushVencimentos}
                    onCheckedChange={(checked) => handleConfigChange('pushVencimentos', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de produção</p>
                    <p className="text-sm text-gray-500">Notificação sobre performance da usina</p>
                  </div>
                  <Switch 
                    checked={configuracoes.pushProducao}
                    onCheckedChange={(checked) => handleConfigChange('pushProducao', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Histórico de Notificações
            </CardTitle>
            {notificacaoNaoLidas > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {notificacaoNaoLidas} não lidas
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notificacoesList.length > 0 ? (
            <div className="space-y-4">
              {notificacoesList.map((notificacao) => {
                const IconComponent = notificacao.icon;
                return (
                  <div 
                    key={notificacao.id} 
                    className={`flex items-start p-4 rounded-lg border transition-colors ${
                      !notificacao.lida ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-full mr-4 ${
                      notificacao.color === 'blue' ? 'bg-blue-100' :
                      notificacao.color === 'yellow' ? 'bg-yellow-100' :
                      notificacao.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        notificacao.color === 'blue' ? 'text-blue-600' :
                        notificacao.color === 'yellow' ? 'text-yellow-600' :
                        notificacao.color === 'green' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${!notificacao.lida ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notificacao.titulo}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{notificacao.mensagem}</p>
                          <p className="text-xs text-gray-500 mt-2">{notificacao.data}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!notificacao.lida && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => marcarComoLida(notificacao.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => excluirNotificacao(notificacao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
              <p className="text-gray-500">Você não possui notificações no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteNotificacoes;
