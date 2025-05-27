
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Edit, Block, CheckCircle, Eye } from 'lucide-react';
import { Geradora } from '../types';

const AdminGeradoras = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockGeradoras: Geradora[] = [
    {
      id: 1,
      nome: 'Solar Tech Ltda',
      email: 'contato@solartech.com',
      cnpj: '12.345.678/0001-90',
      responsavel: 'João Silva',
      telefone: '(11) 99999-9999',
      endereco: 'São Paulo, SP',
      status: 'ativo',
      planoCobranca: {
        tipo: 'percentual',
        percentual: 10,
        salarioMinimoReferencia: 1412
      },
      limiteUsuarios: 50,
      usuariosAtivos: 32,
      dataCadastro: '15/03/2025',
      ultimoPagamento: '01/05/2025'
    },
    {
      id: 2,
      nome: 'Green Energy Co',
      email: 'admin@greenenergy.com',
      cnpj: '98.765.432/0001-10',
      responsavel: 'Maria Santos',
      telefone: '(21) 88888-8888',
      endereco: 'Rio de Janeiro, RJ',
      status: 'pendente',
      planoCobranca: {
        tipo: 'por_usuario',
        valorPorUsuario: 25,
        limitePorUsuario: 30,
        valorAcimaLimite: 35
      },
      limiteUsuarios: 30,
      usuariosAtivos: 18,
      dataCadastro: '20/04/2025'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'bloqueado':
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredGeradoras = mockGeradoras.filter(geradora =>
    geradora.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    geradora.cnpj.includes(searchTerm) ||
    geradora.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Geradoras</h1>
          <p className="text-muted-foreground">Gerencie todas as empresas geradoras do sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Geradora
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CNPJ ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Geradoras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGeradoras.map((geradora) => (
                <TableRow key={geradora.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{geradora.nome}</div>
                      <div className="text-sm text-gray-500">{geradora.cnpj}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{geradora.responsavel}</div>
                      <div className="text-sm text-gray-500">{geradora.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(geradora.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {geradora.usuariosAtivos}/{geradora.limiteUsuarios}
                      <div className="text-xs text-gray-500">
                        {Math.round((geradora.usuariosAtivos / geradora.limiteUsuarios) * 100)}% usado
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {geradora.planoCobranca.tipo === 'percentual' && 
                        `${geradora.planoCobranca.percentual}% SM`}
                      {geradora.planoCobranca.tipo === 'por_usuario' && 
                        `R$ ${geradora.planoCobranca.valorPorUsuario}/usuário`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {geradora.ultimoPagamento || 'Pendente'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {geradora.status === 'ativo' ? (
                          <DropdownMenuItem className="text-red-600">
                            <Block className="h-4 w-4 mr-2" />
                            Bloquear
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGeradoras;
