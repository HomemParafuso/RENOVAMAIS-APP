import React, { useState, useEffect, useCallback, useRef } from 'react';
import { geradoraService } from '@/services/geradoraService';
import { syncService } from '@/services/syncService';
import { useToast } from '@/components/ui/use-toast';
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
import DetalhesGeradoraModal from '@/components/geradora/DetalhesGeradoraModal';
import EditarGeradoraModal from '@/components/geradora/EditarGeradoraModal';
import NovaGeradoraModal from '@/components/geradora/NovaGeradoraModal';

const AdminGeradoras = () => {
  const [geradoras, setGeradoras] = useState<Geradora[]>([]);
  const [geradoraSelecionada, setGeradoraSelecionada] = useState<Geradora | null>(null);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalNovaGeradoraAberto, setModalNovaGeradoraAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'online' | 'offline' | 'unknown'>(syncService.getStatus());
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Função para carregar as geradoras
  const carregarGeradoras = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await geradoraService.getAll();
      setGeradoras(data);
      
      // Atualizar status do Firebase
      const isConnected = await syncService.checkConnection();
      setFirebaseStatus(isConnected ? 'online' : 'offline');
    } catch (error) {
      console.error('Erro ao carregar geradoras:', error);
      toast({
        title: 'Erro ao carregar geradoras',
        description: 'Não foi possível carregar as geradoras. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      setFirebaseStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Iniciar serviço de sincronização e carregar dados ao iniciar
  useEffect(() => {
    carregarGeradoras();
    
    // Iniciar verificação periódica de conexão e sincronização
    syncIntervalRef.current = syncService.startPeriodicSync(60000); // Verificar a cada 1 minuto
    
    // Limpar intervalo ao desmontar o componente
    return () => {
      if (syncIntervalRef.current) {
        syncService.stopPeriodicSync(syncIntervalRef.current);
      }
    };
  }, [carregarGeradoras]);
  
  // Sincronizar manualmente
  const handleSincronizar = async () => {
    setIsLoading(true);
    try {
      const isConnected = await syncService.checkConnection();
      setFirebaseStatus(isConnected ? 'online' : 'offline');
      
      if (isConnected) {
        const result = await syncService.syncPendingOperations();
        if (result.success > 0 || result.failed > 0) {
          toast({
            title: 'Sincronização concluída',
            description: `${result.success} operações sincronizadas com sucesso. ${result.failed} operações falharam.`,
            variant: result.failed > 0 ? 'destructive' : 'default'
          });
          
          // Recarregar dados após sincronização
          await carregarGeradoras();
        } else {
          toast({
            title: 'Nenhuma operação pendente',
            description: 'Não há operações pendentes para sincronizar.',
          });
        }
      } else {
        toast({
          title: 'Firebase indisponível',
          description: 'Não foi possível conectar ao Firebase. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      toast({
        title: 'Erro ao sincronizar',
        description: 'Ocorreu um erro durante a sincronização. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualizarGeradora = (geradora: Geradora) => {
    setGeradoraSelecionada(geradora);
    setModalDetalhesAberto(true);
  };

  const handleEditarGeradora = (geradora: Geradora) => {
    setGeradoraSelecionada(geradora);
    setModalEditarAberto(true);
  };

  const handleSalvarGeradora = async (geradoraAtualizada: Geradora) => {
    setIsLoading(true);
    try {
      await geradoraService.update(geradoraAtualizada);
      await carregarGeradoras();
      toast({
        title: 'Geradora atualizada',
        description: 'A geradora foi atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar geradora:', error);
      toast({
        title: 'Erro ao atualizar geradora',
        description: 'Não foi possível atualizar a geradora. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirGeradora = async (geradora: Geradora) => {
    setIsLoading(true);
    try {
      await geradoraService.delete(geradora.id);
      await carregarGeradoras();
      toast({
        title: 'Geradora excluída',
        description: 'A geradora foi excluída com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir geradora:', error);
      toast({
        title: 'Erro ao excluir geradora',
        description: 'Não foi possível excluir a geradora. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdicionarGeradora = () => {
    setModalNovaGeradoraAberto(true);
  };
  
  const handleSalvarNovaGeradora = async (novaGeradora: Partial<Geradora> & { senha: string }) => {
    setIsLoading(true);
    try {
      console.log("Iniciando cadastro de nova geradora:", novaGeradora.nome);
      
      // Criar a geradora no serviço (que vai criar o usuário com a senha)
      const resultado = await geradoraService.create(novaGeradora as Omit<Geradora, 'id'> & { senha?: string });
      
      if (resultado) {
        console.log("Geradora cadastrada com sucesso:", resultado.nome);
        await carregarGeradoras();
        toast({
          title: 'Geradora cadastrada',
          description: 'A geradora foi cadastrada com sucesso!',
        });
      } else {
        throw new Error("Falha ao cadastrar geradora - resultado nulo");
      }
    } catch (error) {
      console.error('Erro ao cadastrar geradora:', error);
      toast({
        title: 'Erro ao cadastrar geradora',
        description: 'Não foi possível cadastrar a geradora. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGeradoras = geradoras.filter(geradora =>
    geradora.nome.toLowerCase().includes(busca.toLowerCase()) ||
    geradora.cnpj.toLowerCase().includes(busca.toLowerCase()) ||
    geradora.email.toLowerCase().includes(busca.toLowerCase())
  );

  const getPaymentStatusBadge = (ultimoPagamento?: string) => {
    if (!ultimoPagamento) {
      return <Badge variant="secondary">Sem Histórico</Badge>;
    }
    const lastPaymentDate = new Date(ultimoPagamento);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (lastPaymentDate > oneMonthAgo) {
      return <Badge className="bg-green-100 text-green-800">Em Dia</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Geradoras</h1>
          <p className="text-muted-foreground">
            Gerencie as geradoras de energia do sistema
          </p>
          <div className="flex items-center mt-2">
            <div className={`h-3 w-3 rounded-full mr-2 ${
              firebaseStatus === 'online' ? 'bg-green-500' : 
              firebaseStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              Firebase: {firebaseStatus === 'online' ? 'Online' : 
                        firebaseStatus === 'offline' ? 'Offline' : 'Desconhecido'}
            </span>
            {firebaseStatus !== 'online' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-7 px-2" 
                onClick={handleSincronizar}
                disabled={isLoading || firebaseStatus === 'unknown'}
              >
                Sincronizar
              </Button>
            )}
            {syncService.getPendingOperations().length > 0 && (
              <span className="text-sm text-amber-600 ml-2">
                {syncService.getPendingOperations().length} operações pendentes
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Input type="text" placeholder="Buscar geradora..." className="w-64" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={handleAdicionarGeradora}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Geradora
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Geradoras ({filteredGeradoras.length} encontradas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && geradoras.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Carregando geradoras...</p>
            </div>
          ) : filteredGeradoras.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma geradora encontrada com os filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGeradoras.map((geradora) => (
                <Card
                  key={geradora.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleVisualizarGeradora(geradora)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold truncate flex justify-between items-center">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-primary" />
                        {geradora.nome}
                      </div>
                      <Badge>{geradora.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Status de Pagamento: {getPaymentStatusBadge(geradora.ultimoPagamento)}
                    </div>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Clientes Vinculados: <span className="font-medium text-foreground">{geradora.usuariosAtivos || 0}</span>
                    </p>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarGeradora(geradora);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DetalhesGeradoraModal
        isOpen={modalDetalhesAberto}
        onClose={() => setModalDetalhesAberto(false)}
        geradora={geradoraSelecionada}
      />

      {geradoraSelecionada && (
        <EditarGeradoraModal
          isOpen={modalEditarAberto}
          onClose={() => setModalEditarAberto(false)}
          geradora={geradoraSelecionada}
          onSave={handleSalvarGeradora}
          onDelete={handleExcluirGeradora}
        />
      )}

      <NovaGeradoraModal
        isOpen={modalNovaGeradoraAberto}
        onClose={() => setModalNovaGeradoraAberto(false)}
        onSave={handleSalvarNovaGeradora}
      />

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Geradoras Cadastradas</CardTitle>
          <Blocks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{geradoras.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de geradoras ativas no sistema.
          </p>
          <div className="text-xs text-muted-foreground mt-2">
            <span className="mr-1">Status do Firebase:</span>
            <Badge variant={firebaseStatus === 'online' ? 'default' : 'destructive'}>
              {firebaseStatus === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGeradoras;
