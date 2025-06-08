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
import { Search, Filter, Edit } from 'lucide-react';
import { Cliente } from '@/portal-admin/types/cliente';
import { useCliente } from '@/context/ClienteContext';
import { useGeradora } from '@/context/GeradoraContext';
import ClienteDetalhesModal from '@/portal-admin/components/ClienteDetalhesModal';

const AdminClientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeradora, setSelectedGeradora] = useState('todas');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);

  const { clientes, loading: clientesLoading } = useCliente();
  const { geradoras, loading: geradorasLoading } = useGeradora();

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

  const filteredClientes = clientes.filter(cliente => {
    const matchSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.cpfCnpj.includes(searchTerm) ||
                       cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchGeradora = selectedGeradora === 'todas' || 
                         cliente.geradoraId === selectedGeradora;
    
    const matchStatus = selectedStatus === 'todos' || cliente.status === selectedStatus;

    return matchSearch && matchGeradora && matchStatus;
  });

  const handleViewOrEditCliente = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setCurrentCliente(null);
  };

  if (clientesLoading || geradorasLoading) {
    return <div>Carregando clientes...</div>;
  }

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
                  <SelectItem key={geradora.id} value={geradora.id}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientes.map((cliente) => (
              <Card 
                key={cliente.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleViewOrEditCliente(cliente)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold truncate">{cliente.nome}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>Consumo Médio: <span className="font-medium text-foreground">{cliente.consumoMedio || 'N/A'} kWh</span></p>
                  <p>Geradora: <span className="font-medium text-foreground">{geradoras.find(g => g.id === cliente.geradoraId)?.nome || 'N/A'}</span></p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(cliente.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {clientesLoading && filteredClientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Carregando clientes...</p>
            </div>
          )}

          {!clientesLoading && filteredClientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum cliente encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {currentCliente && (
        <ClienteDetalhesModal 
          isOpen={isEditing}
          onClose={handleCloseModal}
          cliente={currentCliente}
        />
      )}
    </div>
  );
};

export default AdminClientes;
