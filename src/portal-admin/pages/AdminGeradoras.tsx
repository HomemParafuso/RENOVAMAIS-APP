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
  const [supabaseStatus, setSupabaseStatus] = useState<'online' | 'offline' | 'unknown'>(syncService.getStatus());
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Função para carregar as geradoras
  const carregarGeradoras = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await geradoraService.getAll();
      setGeradoras(data);
      
      // Atualizar status do Supabase
      const isConnected = await syncService.checkConnection();
      setSupabaseStatus(isConnected ? 'online' : 'offline');
    } catch (error) {
      console.error('Erro ao carregar geradoras:', error);
      toast({
        title: 'Erro ao carregar geradoras',
        description: 'Não foi possível carregar as geradoras. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      setSupabaseStatus('offline');
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
      setSupabaseStatus(isConnected ? 'online' : 'offline');
      
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
          title: 'Supabase indisponível',
          description: 'Não foi possível conectar ao Supabase. Tente novamente mais tarde.',
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
  
  const handleSalvarNovaGeradora = async (novaGeradora: Geradora) => {
    setIsLoading(true);
    try {
      await geradoraService.create(novaGeradora);
      await carregarGeradoras();
      toast({
        title: 'Geradora cadastrada',
        description: 'A geradora foi cadastrada com sucesso!',
      });
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
              supabaseStatus === 'online' ? 'bg-green-500' : 
              supabaseStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              Supabase: {supabaseStatus === 'online' ? 'Online' : 
                        supabaseStatus === 'offline' ? 'Offline' : 'Desconhecido'}
            </span>
            {supabaseStatus !== 'online' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-7 px-2" 
                onClick={handleSincronizar}
                disabled={isLoading || supabaseStatus === 'unknown'}
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
          <Input type="text" placeholder="Buscar geradora..." className="w-64" />
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
            Adicionar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {geradoras.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma geradora cadastrada</h3>
              <p className="text-gray-500 mb-4">Adicione novas geradoras para começar a gerenciar.</p>
              <Button onClick={handleAdicionarGeradora}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Geradora
              </Button>
            </CardContent>
          </Card>
        ) : (
          geradoras.map((geradora) => (
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
                {/* Removido o resumo detalhado dos dados da geradora */}
                <div className="flex justify-end mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVisualizarGeradora(geradora)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleEditarGeradora(geradora)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes da Geradora */}
      {geradoraSelecionada && (
        <DetalhesGeradoraModal
          isOpen={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
          geradora={{
            id: geradoraSelecionada.id,
            nome: geradoraSelecionada.nome,
            potencia: "5 MW", // Exemplo, ajustar conforme necessário
            localizacao: geradoraSelecionada.endereco || "Localização não informada",
            status: geradoraSelecionada.status,
            clientesVinculados: geradoraSelecionada.usuariosAtivos || 0,
            latitude: -8.287221, // Exemplo, ajustar conforme necessário
            longitude: -35.971575 // Exemplo, ajustar conforme necessário
          }}
        />
      )}

      {/* Modal de Edição da Geradora */}
      {geradoraSelecionada && (
        <EditarGeradoraModal
          isOpen={modalEditarAberto}
          onClose={() => setModalEditarAberto(false)}
          geradora={{
            id: geradoraSelecionada.id,
            nome: geradoraSelecionada.nome,
            potencia: "5 MW", // Exemplo, ajustar conforme necessário
            localizacao: geradoraSelecionada.endereco || "Localização não informada",
            status: geradoraSelecionada.status,
            clientesVinculados: geradoraSelecionada.usuariosAtivos || 0
          }}
          onSave={handleSalvarGeradora}
          onDelete={handleExcluirGeradora}
        />
      )}
      
      {/* Modal de Nova Geradora */}
      <NovaGeradoraModal
        isOpen={modalNovaGeradoraAberto}
        onClose={() => setModalNovaGeradoraAberto(false)}
        onSave={handleSalvarNovaGeradora}
        geradoras={geradoras.map(g => ({ nome: g.nome }))}
      />
    </div>
  );
};

export default AdminGeradoras;
