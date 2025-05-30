
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Percent, Users, DollarSign } from 'lucide-react';
import { PlanoCobranca } from '../types';

const AdminCobranca = () => {
  const [salarioMinimo, setSalarioMinimo] = useState('1412');
  
  const planosExemplo = [
    {
      geradora: 'Solar Tech Ltda',
      plano: {
        tipo: 'percentual' as const,
        percentual: 10,
        salarioMinimoReferencia: 1412
      },
      valorCalculado: 141.20,
      usuariosAtivos: 32
    },
    {
      geradora: 'Green Energy Co',
      plano: {
        tipo: 'por_usuario' as const,
        valorPorUsuario: 25,
        limitePorUsuario: 30,
        valorAcimaLimite: 35
      },
      valorCalculado: 750,
      usuariosAtivos: 30
    }
  ];

  const ConfiguracaoPercentual = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Percent className="h-5 w-5 mr-2" />
          Cobrança por Percentual do Salário Mínimo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salario-minimo">Valor do Salário Mínimo (R$)</Label>
            <Input
              id="salario-minimo"
              type="number"
              value={salarioMinimo}
              onChange={(e) => setSalarioMinimo(e.target.value)}
              placeholder="1412"
            />
          </div>
          <div>
            <Label htmlFor="percentual-default">Percentual Padrão (%)</Label>
            <Input
              id="percentual-default"
              type="number"
              placeholder="10"
            />
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Exemplo de Cálculo</h4>
          <p className="text-sm text-blue-700">
            Salário Mínimo: R$ {salarioMinimo} × 10% = R$ {(parseFloat(salarioMinimo) * 0.1).toFixed(2)}
          </p>
        </div>
        <Button className="w-full">Salvar Configurações</Button>
      </CardContent>
    </Card>
  );

  const ConfiguracaoPorUsuario = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Cobrança por Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="valor-usuario">Valor por Usuário (R$)</Label>
            <Input
              id="valor-usuario"
              type="number"
              placeholder="25"
            />
          </div>
          <div>
            <Label htmlFor="limite-usuarios">Limite de Usuários</Label>
            <Input
              id="limite-usuarios"
              type="number"
              placeholder="30"
            />
          </div>
          <div>
            <Label htmlFor="valor-acima-limite">Valor Acima do Limite (R$)</Label>
            <Input
              id="valor-acima-limite"
              type="number"
              placeholder="35"
            />
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Exemplo de Cálculo</h4>
          <p className="text-sm text-green-700">
            30 usuários × R$ 25 = R$ 750,00<br />
            Usuários extras × R$ 35 cada
          </p>
        </div>
        <Button className="w-full">Salvar Configurações</Button>
      </CardContent>
    </Card>
  );

  const ConfiguracaoMista = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Cobrança Mista (Fixo + Por Usuário)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valor-fixo">Taxa Fixa Mensal (R$)</Label>
            <Input
              id="valor-fixo"
              type="number"
              placeholder="100"
            />
          </div>
          <div>
            <Label htmlFor="valor-usuario-misto">Valor por Usuário Extra (R$)</Label>
            <Input
              id="valor-usuario-misto"
              type="number"
              placeholder="15"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="usuarios-inclusos">Usuários Inclusos na Taxa Fixa</Label>
          <Input
            id="usuarios-inclusos"
            type="number"
            placeholder="10"
          />
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Exemplo de Cálculo</h4>
          <p className="text-sm text-purple-700">
            Taxa Fixa: R$ 100 (inclui até 10 usuários)<br />
            20 usuários extras × R$ 15 = R$ 300<br />
            <strong>Total: R$ 400</strong>
          </p>
        </div>
        <Button className="w-full">Salvar Configurações</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestão de Cobrança</h1>
        <p className="text-muted-foreground">Configure os planos de cobrança para as geradoras</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Receita Total Mensal</span>
                <span className="text-lg font-bold text-green-600">R$ 15.240</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Geradoras Ativas</span>
                <span className="text-lg font-bold">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total de Usuários</span>
                <span className="text-lg font-bold">348</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planosExemplo.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.geradora}</div>
                    <div className="text-sm text-gray-500">
                      {item.plano.tipo === 'percentual' ? 'Percentual' : 'Por Usuário'} - {item.usuariosAtivos} usuários
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">R$ {item.valorCalculado.toFixed(2)}</div>
                    <Badge variant="secondary" className="text-xs">
                      {item.plano.tipo === 'percentual' ? `${item.plano.percentual}% SM` : `R$ ${item.plano.valorPorUsuario}/user`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Cobrança</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="percentual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="percentual">Percentual</TabsTrigger>
              <TabsTrigger value="por-usuario">Por Usuário</TabsTrigger>
              <TabsTrigger value="mista">Mista</TabsTrigger>
            </TabsList>
            <TabsContent value="percentual" className="mt-6">
              <ConfiguracaoPercentual />
            </TabsContent>
            <TabsContent value="por-usuario" className="mt-6">
              <ConfiguracaoPorUsuario />
            </TabsContent>
            <TabsContent value="mista" className="mt-6">
              <ConfiguracaoMista />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCobranca;
