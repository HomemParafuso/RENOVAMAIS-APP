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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Cliente } from '../types';

const AdminClientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeradora, setSelectedGeradora] = useState('todas');
  const [selectedStatus, setSelectedStatus] = useState('todos');

  const mockClientes: Cliente[] = [
    {
      id: 1,
      nome: 'Carlos Silva',
      cpf: '123.456.789-00',
      email: 'carlos@email.com',
      telefone: '(11) 99999-1111',
      endereco: 'São Paulo, SP',
      geradoraId: 1,
      geradoraNome: 'Solar Tech Ltda',
      status: 'ativo',
      dataCadastro: '20/03/2025',
      consumoMedio: 450,
      imoveis: [
        {
          id: 1,
          endereco: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          consumoMedio: 350,
          potenciaInstalada: 5.5,
          dataInstalacao: '15/01/2024',
          status: 'ativo',
          geradoraId: 1,
          geradoraNome: 'Solar Tech Ltda'
        },
        {
          id: 2,
          endereco: 'Av. Paulista, 456',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01311-100',
          consumoMedio: 100,
          potenciaInstalada: 2.0,
          dataInstalacao: '20/03/2024',
          status: 'ativo',
          geradoraId: 1,
          geradoraNome: 'Solar Tech Ltda'
        }
      ]
    },
    {
      id: 2,
      nome: 'Ana Costa',
      cpf: '987.654.321-00',
      email: 'ana@email.com',
      telefone: '(21) 88888-2222',
      endereco: 'Rio de Janeiro, RJ',
      geradoraId: 2,
      geradoraNome: 'Green Energy Co',
      status: 'ativo',
      dataCadastro: '25/04/2025',
      consumoMedio: 380,
      imoveis: [
        {
          id: 3,
          endereco: 'Rua Copacabana, 789',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          cep: '22070-001',
          consumoMedio: 380,
          potenciaInstalada: 4.2,
          dataInstalacao: '10/02/2024',
          status: 'ativo',
          geradoraId: 2,
          geradoraNome: 'Green Energy Co'
        }
      ]
    }
  ];

  const geradoras = [
    { id: 1, nome: 'Solar Tech Ltda' },
    { id: 2, nome: 'Green Energy Co' }
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

  const filteredClientes = mockClientes.filter(cliente => {
    const matchSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.cpf.includes(searchTerm) ||
                       cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchGeradora = selectedGeradora === 'todas' || 
                         cliente.geradoraId.toString() === selectedGeradora;
    
    const matchStatus = selectedStatus === 'todos' || cliente.status === selectedStatus;

    return matchSearch && matchGeradora && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Gerencie todos os clientes do sistema</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CPF, email ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGeradora} onValueChange={setSelectedGeradora}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por geradora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as geradoras</SelectItem>
                {geradoras.map((geradora) => (
                  <SelectItem key={geradora.id} value={geradora.id.toString()}>
                    {geradora.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedGeradora('todas');
              setSelectedStatus('todos');
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Clientes ({filteredClientes.length} encontrados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Geradora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consumo Médio</TableHead>
                <TableHead>Imóveis</TableHead>
                <TableHead>Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-sm text-gray-500">{cliente.cpf}</div>
                      <div className="text-sm text-gray-500">{cliente.endereco}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{cliente.email}</div>
                      <div className="text-sm text-gray-500">{cliente.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{cliente.geradoraNome}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{cliente.consumoMedio} kWh</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{cliente.imoveis.length} imóvel(is)</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{cliente.dataCadastro}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredClientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum cliente encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClientes;
