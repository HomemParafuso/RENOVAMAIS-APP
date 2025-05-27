import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Blocks, 
  Eye 
} from 'lucide-react';
import { Geradora } from '../types';

const AdminGeradoras = () => {
  const [geradoras, setGeradoras] = useState<Geradora[]>([
    {
      id: 1,
      nome: 'Usina Solar São Paulo I',
      email: 'contato@usinasolarsp1.com.br',
      cnpj: '12.345.678/0001-90',
      responsavel: 'João da Silva',
      telefone: '(11) 99999-9999',
      endereco: 'Avenida Paulista, 123',
      status: 'ativo',
      planoCobranca: { tipo: 'percentual', percentual: 5 },
      limiteUsuarios: 100,
      usuariosAtivos: 50,
      dataCadastro: '01/01/2024',
      ultimoPagamento: '10/05/2024',
    },
    {
      id: 2,
      nome: 'Usina Eólica Bahia II',
      email: 'contato@usinaeolicaba2.com.br',
      cnpj: '98.765.432/0001-10',
      responsavel: 'Maria Souza',
      telefone: '(71) 88888-8888',
      endereco: 'Rua da Praia, 456',
      status: 'pendente',
      planoCobranca: { tipo: 'fixo', valorFixo: 1000 },
      limiteUsuarios: 50,
      usuariosAtivos: 25,
      dataCadastro: '15/02/2024',
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Geradoras</h1>
          <p className="text-muted-foreground">
            Gerencie as geradoras de energia do sistema
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Input type="text" placeholder="Buscar geradora..." className="w-64" />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {geradoras.map((geradora) => (
          <Card key={geradora.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <span>{geradora.nome}</span>
                </div>
                <div>
                  {geradora.status === 'ativo' && (
                    <Badge variant="secondary">Ativo</Badge>
                  )}
                  {geradora.status === 'pendente' && (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                  {geradora.status === 'bloqueado' && (
                    <Badge variant="destructive">Bloqueado</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email
                  </p>
                  <p className="text-gray-900">{geradora.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    CNPJ
                  </p>
                  <p className="text-gray-900">{geradora.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Responsável
                  </p>
                  <p className="text-gray-900">{geradora.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Telefone
                  </p>
                  <p className="text-gray-900">{geradora.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Endereço
                  </p>
                  <p className="text-gray-900">{geradora.endereco}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Plano de Cobrança
                  </p>
                  <p className="text-gray-900">
                    {geradora.planoCobranca.tipo}
                    {geradora.planoCobranca.percentual &&
                      ` (${geradora.planoCobranca.percentual}%)`}
                    {geradora.planoCobranca.valorFixo &&
                      ` (R$ ${geradora.planoCobranca.valorFixo})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Limite de Usuários
                  </p>
                  <p className="text-gray-900">{geradora.limiteUsuarios}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Usuários Ativos
                  </p>
                  <p className="text-gray-900">{geradora.usuariosAtivos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Data de Cadastro
                  </p>
                  <p className="text-gray-900">{geradora.dataCadastro}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Último Pagamento
                  </p>
                  <p className="text-gray-900">
                    {geradora.ultimoPagamento || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGeradoras;
