
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart, TrendingUp, Users, Building2 } from 'lucide-react';

const AdminRelatorios = () => {
  const relatorios = [
    {
      titulo: 'Receita Mensal',
      descricao: 'Relatório detalhado da receita por geradora',
      icone: TrendingUp,
      cor: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      titulo: 'Crescimento de Usuários',
      descricao: 'Análise do crescimento de clientes por período',
      icone: Users,
      cor: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      titulo: 'Performance das Geradoras',
      descricao: 'Desempenho e métricas por geradora',
      icone: Building2,
      cor: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      titulo: 'Análise de Cobrança',
      descricao: 'Relatório de faturas e pagamentos',
      icone: BarChart,
      cor: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Gere e baixe relatórios detalhados do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatorios.map((relatorio, index) => {
          const Icon = relatorio.icone;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 ${relatorio.bg} rounded-lg mr-4`}>
                      <Icon className={`h-6 w-6 ${relatorio.cor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {relatorio.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar PDF
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Relatórios Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Relatórios Personalizados
            </h3>
            <p className="text-gray-500 mb-4">
              Configure relatórios específicos com filtros e métricas personalizadas
            </p>
            <Button>Criar Relatório Personalizado</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRelatorios;
