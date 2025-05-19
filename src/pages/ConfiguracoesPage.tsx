
import React from "react";
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

const ConfiguracoesPage = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Personalize as configurações do seu sistema</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">Salvar Alterações</Button>
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
                <Input id="nomeEmpresa" placeholder="Nome da sua empresa" />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="CNPJ da empresa" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="Telefone para contato" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email para contato" />
                </div>
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Endereço completo" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Personalização</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema e documentos gerados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="corPrimaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input id="corPrimaria" defaultValue="#22C55E" className="flex-1" />
                    <div className="w-10 h-10 rounded bg-green-500 border"></div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="corSecundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input id="corSecundaria" defaultValue="#64748B" className="flex-1" />
                    <div className="w-10 h-10 rounded bg-gray-500 border"></div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="mt-1">
                  <Button variant="outline">Fazer Upload</Button>
                </div>
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
                  <Input id="tarifaUso" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="tarifaEnergia">Tarifa de Energia (TE)</Label>
                  <Input id="tarifaEnergia" type="number" placeholder="0.00" />
                </div>
              </div>
              <div>
                <Label htmlFor="concessionaria">Concessionária</Label>
                <Select>
                  <SelectTrigger id="concessionaria">
                    <SelectValue placeholder="Selecione a concessionária" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enel">Enel</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="cemig">Cemig</SelectItem>
                    <SelectItem value="copel">Copel</SelectItem>
                    <SelectItem value="outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cálculos Padrão</CardTitle>
              <CardDescription>
                Defina os valores padrão para novos clientes e faturas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoCalculo">Tipo de Cálculo Padrão</Label>
                  <Select defaultValue="percentual">
                    <SelectTrigger id="tipoCalculo">
                      <SelectValue placeholder="Selecione o tipo de cálculo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual de Economia</SelectItem>
                      <SelectItem value="valor">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="percentualDesconto">Percentual de Desconto Padrão</Label>
                  <Input id="percentualDesconto" type="number" placeholder="10%" />
                </div>
              </div>
              <div>
                <Label htmlFor="observacaoPadrao">Observação Padrão para Faturas</Label>
                <Textarea id="observacaoPadrao" placeholder="Texto padrão que aparecerá nas faturas" />
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
                  <Input id="emailRemetente" type="email" placeholder="seu@email.com" />
                </div>
                <div>
                  <Label htmlFor="nomeRemetente">Nome do Remetente</Label>
                  <Input id="nomeRemetente" placeholder="Nome da Empresa" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notificacaoAutomatica" />
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
                />
              </div>
              <div>
                <Label htmlFor="templateLembrete">Template para Lembrete de Vencimento</Label>
                <Textarea 
                  id="templateLembrete" 
                  placeholder="Olá {nome}, lembre-se que sua fatura vence em {dias} dias..."
                  className="min-h-[100px]"
                />
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
                  <h3 className="font-medium">API de Pagamentos</h3>
                  <p className="text-sm text-muted-foreground">Integração para processamento de pagamentos</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Monitoramento de Geração</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema de monitoramento solar</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium">Exportação Contábil</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema contábil</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesPage;
