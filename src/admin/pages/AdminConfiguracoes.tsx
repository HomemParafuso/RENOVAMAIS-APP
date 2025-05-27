
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Shield, Database } from 'lucide-react';

const AdminConfiguracoes = () => {
  const [emailNotificacoes, setEmailNotificacoes] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(true);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie as configurações globais do sistema</p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome-sistema">Nome do Sistema</Label>
                  <Input
                    id="nome-sistema"
                    defaultValue="Sistema de Gestão Solar"
                  />
                </div>
                <div>
                  <Label htmlFor="versao">Versão</Label>
                  <Input
                    id="versao"
                    defaultValue="1.0.0"
                    disabled
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  defaultValue="Sistema completo para gestão de geradoras de energia solar e seus clientes"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="manutencao"
                  checked={false}
                  onCheckedChange={() => {}}
                />
                <Label htmlFor="manutencao">Modo Manutenção</Label>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Configurações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-remetente">Email Remetente</Label>
                  <Input
                    id="email-remetente"
                    type="email"
                    placeholder="sistema@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="senha-email">Senha</Label>
                  <Input
                    id="senha-email"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notificacoes"
                  checked={emailNotificacoes}
                  onCheckedChange={setEmailNotificacoes}
                />
                <Label htmlFor="email-notificacoes">Enviar Notificações por Email</Label>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senha-atual">Senha Atual</Label>
                <Input
                  id="senha-atual"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="nova-senha">Nova Senha</Label>
                <Input
                  id="nova-senha"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmar-senha"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Autenticação de Dois Fatores</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="log-atividades" defaultChecked />
                  <Label htmlFor="log-atividades">Log de Atividades</Label>
                </div>
              </div>
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup e Restauração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="backup-automatico"
                  checked={backupAutomatico}
                  onCheckedChange={setBackupAutomatico}
                />
                <Label htmlFor="backup-automatico">Backup Automático</Label>
              </div>
              
              {backupAutomatico && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label htmlFor="frequencia">Frequência</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      type="time"
                      defaultValue="02:00"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Ações de Backup</h4>
                <div className="flex gap-2">
                  <Button>Fazer Backup Agora</Button>
                  <Button variant="outline">Restaurar Backup</Button>
                  <Button variant="outline">Download Backup</Button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Histórico de Backups</h4>
                <div className="space-y-2">
                  {[
                    { data: '2025-05-27 02:00', tamanho: '245 MB', status: 'Sucesso' },
                    { data: '2025-05-26 02:00', tamanho: '243 MB', status: 'Sucesso' },
                    { data: '2025-05-25 02:00', tamanho: '241 MB', status: 'Sucesso' }
                  ].map((backup, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{backup.data}</div>
                        <div className="text-sm text-gray-500">{backup.tamanho}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">{backup.status}</span>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminConfiguracoes;
