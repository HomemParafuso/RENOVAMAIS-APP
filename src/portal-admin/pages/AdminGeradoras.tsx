import React, { useState, useEffect } from 'react';
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
  Eye,
  Loader2
} from 'lucide-react';
import { Geradora } from '@/portal-admin/types'; // Usando a interface correta do portal-admin
import { geradoraService } from '@/services/geradoraService';

const AdminGeradoras = () => {
  const [geradoras, setGeradoras] = useState<Geradora[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGeradoras, setFilteredGeradoras] = useState<Geradora[]>([]);

  useEffect(() => {
    const fetchGeradoras = async () => {
      try {
        setLoading(true);
      const data = await geradoraService.getAll();
      setGeradoras(data);
        setFilteredGeradoras(data);
        setLoading(false);
    } catch (error) {
        console.error('Erro ao buscar geradoras:', error);
        setLoading(false);
      }
    };

    fetchGeradoras();
  }, []);

  // Função para filtrar geradoras com base no termo de busca
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredGeradoras(geradoras);
      return;
    }

    const termLower = searchTerm.toLowerCase();
    const filtered = geradoras.filter(geradora => 
      geradora.nome.toLowerCase().includes(termLower) ||
      geradora.email.toLowerCase().includes(termLower) ||
      geradora.cnpj?.toLowerCase().includes(termLower) ||
      geradora.responsavel?.toLowerCase().includes(termLower)
    );
    
    setFilteredGeradoras(filtered);
  };

  // Função para filtrar por status
  const filterByStatus = (status: string) => {
    if (status === 'todos') {
      setFilteredGeradoras(geradoras);
      return;
    }
    
    const filtered = geradoras.filter(geradora => geradora.status === status);
    setFilteredGeradoras(filtered);
  };

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
          <Input 
            type="text" 
            placeholder="Buscar geradora..." 
            className="w-64" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => filterByStatus('todos')}
            >
              Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => filterByStatus('ativo')}
            >
              Ativos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => filterByStatus('pendente')}
            >
              Pendentes
          </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Carregando geradoras...</span>
          </div>
        ) : filteredGeradoras.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma geradora encontrada</p>
          </div>
        ) : (
          filteredGeradoras.map((geradora) => (
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
          ))
        )}
          </div>
    </div>
  );
};

export default AdminGeradoras;
