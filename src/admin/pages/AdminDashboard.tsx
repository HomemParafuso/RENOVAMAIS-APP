
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Geradoras Ativas',
      value: '12',
      change: '+2 este mês',
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total de Clientes',
      value: '348',
      change: '+23 este mês',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 15.240',
      change: '+12% vs mês anterior',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Taxa de Crescimento',
      value: '18%',
      change: 'Crescimento sustentável',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema e métricas principais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 ${stat.bg} rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Geradoras Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: 'Solar Tech Ltda', status: 'Ativo', data: '15/05/2025' },
                { nome: 'Green Energy Co', status: 'Pendente', data: '12/05/2025' },
                { nome: 'Eco Power Solutions', status: 'Ativo', data: '08/05/2025' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-gray-500">Cadastrado em {item.data}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-yellow-800">Pagamento Pendente</p>
                  <p className="text-sm text-yellow-700">Solar Tech Ltda - Vencimento: 20/05</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-red-800">Limite de Usuários</p>
                  <p className="text-sm text-red-700">Green Energy - 95% do limite atingido</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-blue-800">Nova Solicitação</p>
                  <p className="text-sm text-blue-700">Eco Power - Aumento de limite</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
