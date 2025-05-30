import { supabase } from '@/lib/supabase';
import { Geradora } from '@/portal-admin/types';
import { syncService } from './syncService';

// Mapeamento entre o modelo Geradora e a tabela users do Supabase
interface UserGeradora {
  id: string; // UUID no Supabase
  email: string;
  name: string; // Corresponde ao nome da geradora
  role: 'geradora';
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  // Campos adicionais como metadados JSON
  cnpj?: string;
  responsavel?: string;
  telefone?: string;
  endereco?: string;
  status?: 'ativo' | 'bloqueado' | 'pendente';
  plano_cobranca?: {
    tipo: 'percentual' | 'fixo' | 'por_usuario' | 'misto';
    percentual?: number;
    valorFixo?: number;
    valorPorUsuario?: number;
  };
  limite_usuarios?: number;
  usuarios_ativos?: number;
  ultimo_pagamento?: string;
}

/**
 * Converte um objeto UserGeradora do Supabase para o modelo Geradora da aplicação
 */
function mapUserToGeradora(user: UserGeradora): Geradora {
  return {
    id: user.id,
    nome: user.name,
    email: user.email,
    cnpj: user.cnpj || '',
    responsavel: user.responsavel || '',
    telefone: user.telefone || '',
    endereco: user.endereco || '',
    status: user.status || 'pendente',
    planoCobranca: user.plano_cobranca ? {
      tipo: user.plano_cobranca.tipo,
      percentual: user.plano_cobranca.percentual,
      valorFixo: user.plano_cobranca.valorFixo,
      valorPorUsuario: user.plano_cobranca.valorPorUsuario
    } : {
      tipo: 'percentual',
      percentual: 5
    },
    limiteUsuarios: user.limite_usuarios || 10,
    usuariosAtivos: user.usuarios_ativos || 0,
    dataCadastro: user.created_at,
    ultimoPagamento: user.ultimo_pagamento
  };
}

/**
 * Converte um objeto Geradora da aplicação para o formato UserGeradora do Supabase
 */
function mapGeradoraToUser(geradora: Partial<Geradora>): Partial<UserGeradora> {
  return {
    name: geradora.nome,
    email: geradora.email,
    role: 'geradora',
    cnpj: geradora.cnpj,
    responsavel: geradora.responsavel,
    telefone: geradora.telefone,
    endereco: geradora.endereco,
    status: geradora.status,
    plano_cobranca: geradora.planoCobranca,
    limite_usuarios: geradora.limiteUsuarios,
    usuarios_ativos: geradora.usuariosAtivos || 0,
    ultimo_pagamento: geradora.ultimoPagamento
  };
}

/**
 * Serviço para gerenciar operações relacionadas às geradoras no Supabase
 */
export const geradoraService = {
  /**
   * Busca todas as geradoras
   */
  async getAll(): Promise<Geradora[]> {
    try {
      // Verificar se o Supabase está disponível e com permissões corretas
      const hasPermissions = await this.checkSupabasePermissions();
      
      if (hasPermissions) {
        // Se o Supabase estiver disponível, tentar buscar de lá primeiro
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'geradora');
          
          if (error) throw error;
          
          const geradoras = (data || []).map(mapUserToGeradora);
          
          // Mesclar com geradoras locais que ainda não foram sincronizadas
          const geradorasSalvas = localStorage.getItem('geradoras');
          if (geradorasSalvas) {
            const geradorasLocais = JSON.parse(geradorasSalvas);
            // Filtrar apenas geradoras locais (IDs que começam com "local-")
            const apenasLocais = geradorasLocais.filter((g: Geradora) => g.id.startsWith('local-'));
            
            // Combinar geradoras do Supabase com geradoras locais
            const todasGeradoras = [...geradoras, ...apenasLocais];
            
            // Atualizar localStorage com todas as geradoras
            localStorage.setItem('geradoras', JSON.stringify(todasGeradoras));
            
            return todasGeradoras;
          }
          
          // Se não houver geradoras locais, salvar apenas as do Supabase no localStorage
          localStorage.setItem('geradoras', JSON.stringify(geradoras));
          
          return geradoras;
        } catch (supabaseError) {
          console.error('Erro ao buscar geradoras do Supabase:', supabaseError);
          // Se falhar no Supabase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        try {
          return JSON.parse(geradorasSalvas);
        } catch (e) {
          console.error('Erro ao carregar geradoras do localStorage:', e);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar geradoras:', error);
      
      // Último recurso: tentar o localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        try {
          return JSON.parse(geradorasSalvas);
        } catch (e) {
          console.error('Erro ao carregar geradoras do localStorage:', e);
        }
      }
      
      return [];
    }
  },

  /**
   * Busca uma geradora pelo ID
   */
  async getById(id: string): Promise<Geradora | null> {
    try {
      // Se o ID começa com "local-", é uma geradora criada localmente
      // Buscar apenas no localStorage
      if (id.startsWith('local-')) {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          try {
            const geradoras = JSON.parse(geradorasSalvas);
            const geradora = geradoras.find((g: Geradora) => g.id === id);
            if (geradora) {
              return geradora;
            }
          } catch (e) {
            console.error('Erro ao carregar geradoras do localStorage:', e);
          }
        }
        return null;
      }
      
      // Para IDs que não são locais, verificar se o Supabase está disponível
      const hasPermissions = await this.checkSupabasePermissions();
      
      if (hasPermissions) {
        // Se o Supabase estiver disponível, tentar buscar de lá primeiro
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .eq('role', 'geradora')
            .single();
          
          if (error) throw error;
          
          if (data) {
            const geradora = mapUserToGeradora(data as UserGeradora);
            
            // Atualizar no localStorage também
            const geradorasSalvas = localStorage.getItem('geradoras');
            if (geradorasSalvas) {
              const geradoras = JSON.parse(geradorasSalvas);
              const geradorasAtualizadas = geradoras.map((g: Geradora) => 
                g.id === id ? geradora : g
              );
              localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
            }
            
            return geradora;
          }
        } catch (supabaseError) {
          console.error(`Erro ao buscar geradora com ID ${id} do Supabase:`, supabaseError);
          // Se falhar no Supabase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        try {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradora = geradoras.find((g: Geradora) => g.id === id);
          if (geradora) {
            return geradora;
          }
        } catch (e) {
          console.error('Erro ao carregar geradoras do localStorage:', e);
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar geradora com ID ${id}:`, error);
      
      // Último recurso: tentar o localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        try {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradora = geradoras.find((g: Geradora) => g.id === id);
          if (geradora) {
            return geradora;
          }
        } catch (e) {
          console.error('Erro ao carregar geradoras do localStorage:', e);
        }
      }
      
      return null;
    }
  },

  /**
   * Verifica se o Supabase está disponível e com permissões corretas
   */
  async checkSupabasePermissions(): Promise<boolean> {
    try {
      // Verificar se o Supabase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (!isConnected) {
        console.log('Supabase não está conectado');
        return false;
      }
      
      // Verificar se temos permissões para inserir na tabela users
      // Tentamos inserir um registro temporário e depois excluí-lo
      // Deixamos o Supabase gerar o ID automaticamente
      // Usamos 'admin' como role, que é um valor válido para a restrição users_role_check
      // A restrição aceita 'admin', 'geradora' e 'cliente'
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'admin', // Valor válido para a restrição users_role_check
          is_approved: false
        })
        .select();
      
      if (error) {
        console.error('Erro ao verificar permissões do Supabase:', error);
        console.error('Detalhes do erro:', error.message, error.details, error.hint);
        
        // Tentar com 'geradora' se 'admin' falhar
        try {
          const { data: data2, error: error2 } = await supabase
            .from('users')
            .insert({
              email: `test-${Date.now()}@example.com`,
              name: 'Test User',
              role: 'geradora', // Tentar com 'geradora'
              is_approved: false
            })
            .select();
            
          if (error2) {
            console.error('Erro ao verificar permissões com role="geradora":', error2);
            return false;
          }
          
          console.log('Permissão verificada com sucesso usando role="geradora"');
          
          // Excluir o registro de teste
          if (data2 && data2.length > 0) {
            const testId = data2[0].id;
            await supabase
              .from('users')
              .delete()
              .eq('id', testId);
          }
          
          return true;
        } catch (error3) {
          console.error('Erro ao tentar verificar permissões com role="geradora":', error3);
          return false;
        }
      }
      
      console.log('Permissão verificada com sucesso usando role="admin"');
      
      // Excluir o registro de teste
      if (data && data.length > 0) {
        const testId = data[0].id;
        await supabase
          .from('users')
          .delete()
          .eq('id', testId);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar permissões do Supabase:', error);
      return false;
    }
  },

  /**
   * Cria uma nova geradora
   */
  async create(geradora: Omit<Geradora, 'id'>): Promise<Geradora | null> {
    try {
      // Verificar se o Supabase está disponível e com permissões corretas
      const hasPermissions = await this.checkSupabasePermissions();
      
      if (hasPermissions) {
        // Se o Supabase estiver disponível, tentar salvar diretamente
        try {
          // Gerar uma senha temporária
          const tempPassword = Math.random().toString(36).slice(-8);
          
          // Criar o usuário na tabela auth do Supabase
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: geradora.email!,
            password: tempPassword,
            options: {
              data: {
                role: 'geradora',
                name: geradora.nome
              }
            }
          });
          
          if (authError) throw authError;
          
          if (!authData.user) {
            throw new Error('Falha ao criar usuário');
          }
          
          // Inserir os dados da geradora na tabela users
          // Tentar primeiro com role='geradora'
          let userData, userError;
          try {
            const result = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: geradora.email,
                password_hash: 'auth_managed', // A senha é gerenciada pelo Auth
                role: 'geradora',
                name: geradora.nome,
                is_approved: true,
                cnpj: geradora.cnpj,
                responsavel: geradora.responsavel,
                telefone: geradora.telefone,
                endereco: geradora.endereco,
                status: geradora.status,
                plano_cobranca: geradora.planoCobranca,
                limite_usuarios: geradora.limiteUsuarios,
                usuarios_ativos: 0
              })
              .select()
              .single();
              
            userData = result.data;
            userError = result.error;
          } catch (insertError) {
            console.error('Erro ao inserir geradora com role="geradora":', insertError);
            
            // Se falhar, tentar com role='admin'
            const result = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: geradora.email,
                password_hash: 'auth_managed', // A senha é gerenciada pelo Auth
                role: 'admin', // Tentar com 'admin' se 'geradora' falhar
                name: geradora.nome,
                is_approved: true,
                cnpj: geradora.cnpj,
                responsavel: geradora.responsavel,
                telefone: geradora.telefone,
                endereco: geradora.endereco,
                status: geradora.status,
                plano_cobranca: geradora.planoCobranca,
                limite_usuarios: geradora.limiteUsuarios,
                usuarios_ativos: 0
              })
              .select()
              .single();
              
            userData = result.data;
            userError = result.error;
          }
          
          if (userError) throw userError;
          
          const novaGeradora = mapUserToGeradora(userData as UserGeradora);
          
          // Salvar também no localStorage como fallback
          const geradoras = await this.getAll();
          localStorage.setItem('geradoras', JSON.stringify([...geradoras, novaGeradora]));
          
          syncService.notifyAdmin(
            'Geradora cadastrada no Supabase', 
            `A geradora "${geradora.nome}" foi cadastrada com sucesso no Supabase.`
          );
          
          return novaGeradora;
        } catch (supabaseError) {
          console.error('Erro ao criar geradora no Supabase:', supabaseError);
          // Se falhar no Supabase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Supabase não estiver disponível ou falhar
      const novaGeradora = {
        ...geradora,
        id: `local-${Date.now()}`,
        dataCadastro: new Date().toISOString(),
        usuariosAtivos: 0
      } as Geradora;
      
      // Salvar no localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      const geradoras = geradorasSalvas ? JSON.parse(geradorasSalvas) : [];
      const novasGeradoras = [...geradoras, novaGeradora];
      localStorage.setItem('geradoras', JSON.stringify(novasGeradoras));
      
      // Adicionar à fila de sincronização para quando o Supabase estiver disponível
      syncService.addPendingOperation({
        type: 'create',
        table: 'users',
        data: {
          email: geradora.email,
          password_hash: 'local_temp',
          role: 'geradora',
          name: geradora.nome,
          is_approved: true,
          cnpj: geradora.cnpj,
          responsavel: geradora.responsavel,
          telefone: geradora.telefone,
          endereco: geradora.endereco,
          status: geradora.status,
          plano_cobranca: geradora.planoCobranca,
          limite_usuarios: geradora.limiteUsuarios,
          usuarios_ativos: 0
        }
      });
      
      syncService.notifyAdmin(
        'Geradora cadastrada localmente', 
        `A geradora "${geradora.nome}" foi cadastrada com sucesso no modo local e será sincronizada quando o Supabase estiver disponível.`
      );
      
      return novaGeradora;
    } catch (error) {
      console.error('Erro ao criar geradora:', error);
      return null;
    }
  },

  /**
   * Atualiza uma geradora existente
   */
  async update(geradora: Geradora): Promise<Geradora | null> {
    try {
      // Se o ID começa com "local-", é uma geradora criada localmente
      // Atualizar apenas no localStorage
      if (geradora.id.startsWith('local-')) {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradorasAtualizadas = geradoras.map((g: Geradora) => g.id === geradora.id ? geradora : g);
          localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
          
          syncService.notifyAdmin(
            'Geradora local atualizada', 
            `A geradora "${geradora.nome}" foi atualizada com sucesso no modo local.`
          );
          
          return geradora;
        }
        return null;
      }
      
      // Para IDs que não são locais, verificar se o Supabase está disponível e com permissões corretas
      const hasPermissions = await this.checkSupabasePermissions();
      
      if (hasPermissions) {
        // Se o Supabase estiver disponível, tentar atualizar lá primeiro
        try {
          // Atualizar dados do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .update({
              name: geradora.nome,
              email: geradora.email,
              updated_at: new Date().toISOString(),
              cnpj: geradora.cnpj,
              responsavel: geradora.responsavel,
              telefone: geradora.telefone,
              endereco: geradora.endereco,
              status: geradora.status,
              plano_cobranca: geradora.planoCobranca,
              limite_usuarios: geradora.limiteUsuarios,
              usuarios_ativos: geradora.usuariosAtivos
            })
            .eq('id', geradora.id)
            .select()
            .single();
          
          if (userError) throw userError;
          
          const geradoraAtualizada = mapUserToGeradora(userData as UserGeradora);
          
          // Atualizar também no localStorage como fallback
          const geradorasSalvas = localStorage.getItem('geradoras');
          if (geradorasSalvas) {
            const geradoras = JSON.parse(geradorasSalvas);
            const geradorasAtualizadas = geradoras.map((g: Geradora) => 
              g.id === geradora.id ? geradoraAtualizada : g
            );
            localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
          }
          
          syncService.notifyAdmin(
            'Geradora atualizada no Supabase', 
            `A geradora "${geradora.nome}" foi atualizada com sucesso no Supabase.`
          );
          
          return geradoraAtualizada;
        } catch (supabaseError) {
          console.error(`Erro ao atualizar geradora com ID ${geradora.id} no Supabase:`, supabaseError);
          // Se falhar no Supabase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Supabase não estiver disponível ou falhar
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        const geradoras = JSON.parse(geradorasSalvas);
        const geradorasAtualizadas = geradoras.map((g: Geradora) => g.id === geradora.id ? geradora : g);
        localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
      }
      
      // Adicionar à fila de sincronização
      syncService.addPendingOperation({
        type: 'update',
        table: 'users',
        entityId: geradora.id,
        data: {
          name: geradora.nome,
          email: geradora.email,
          updated_at: new Date().toISOString(),
          cnpj: geradora.cnpj,
          responsavel: geradora.responsavel,
          telefone: geradora.telefone,
          endereco: geradora.endereco,
          status: geradora.status,
          plano_cobranca: geradora.planoCobranca,
          limite_usuarios: geradora.limiteUsuarios,
          usuarios_ativos: geradora.usuariosAtivos
        }
      });
      
      syncService.notifyAdmin(
        'Geradora atualizada localmente', 
        `A geradora "${geradora.nome}" foi atualizada localmente e será sincronizada quando o Supabase estiver disponível.`
      );
      
      return geradora;
    } catch (error) {
      console.error(`Erro ao atualizar geradora com ID ${geradora.id}:`, error);
      
      // Último recurso: tentar atualizar apenas no localStorage
      try {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradorasAtualizadas = geradoras.map((g: Geradora) => g.id === geradora.id ? geradora : g);
          localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
          
          syncService.notifyAdmin(
            'Geradora atualizada apenas localmente', 
            `A geradora "${geradora.nome}" foi atualizada apenas localmente devido a um erro.`
          );
          
          return geradora;
        }
      } catch (localError) {
        console.error(`Erro ao atualizar geradora no localStorage:`, localError);
      }
      
      return null;
    }
  },

  /**
   * Exclui uma geradora
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Primeiro, verificar se a geradora existe no localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        const geradoras = JSON.parse(geradorasSalvas);
        // Armazenar a geradora antes de excluí-la para exibir o nome na notificação
        const geradora = geradoras.find((g: Geradora) => g.id === id);
        
        if (geradora) {
          // Remover do localStorage
          const geradorasAtualizadas = geradoras.filter((g: Geradora) => g.id !== id);
          localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
          
          // Se o ID começa com "local-", é uma geradora criada localmente
          // Não precisamos sincronizar com o Supabase
          if (id.startsWith('local-')) {
            syncService.notifyAdmin(
              'Geradora excluída', 
              `A geradora "${geradora.nome}" foi excluída com sucesso.`
            );
            return true;
          }
          
          // Se não é uma geradora local, tentar excluir do Supabase também
          // Verificar se o Supabase está disponível e com permissões corretas
          const hasPermissions = await this.checkSupabasePermissions();
          
          if (hasPermissions) {
            // Se o Supabase estiver disponível, tentar excluir
            try {
              // Verificar se o ID é um UUID válido (formato usado pelo Supabase)
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
              
              if (isUUID) {
                // Excluir o usuário
                const { error: userError } = await supabase
                  .from('users')
                  .delete()
                  .eq('id', id);
                
                if (userError) throw userError;
                
                // Também desativar o usuário no Auth
                try {
                  await supabase.auth.admin.deleteUser(id);
                } catch (authError) {
                  console.error(`Erro ao excluir usuário do Auth com ID ${id}:`, authError);
                  // Continuar mesmo se falhar no Auth, pois já excluímos da tabela users
                }
                
                syncService.notifyAdmin(
                  'Geradora excluída no Supabase', 
                  `A geradora "${geradora.nome}" foi excluída com sucesso do Supabase.`
                );
                
                return true;
              }
            } catch (supabaseError) {
              console.error(`Erro ao excluir geradora do Supabase com ID ${id}:`, supabaseError);
              // Se falhar no Supabase, cair no fallback para exclusão apenas local
            }
          }
          
          // Se o Supabase não estiver disponível ou falhar, adicionar à fila de sincronização
          // Verificar se o ID é um UUID válido (formato usado pelo Supabase)
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            syncService.addPendingOperation({
              type: 'delete',
              table: 'users',
              entityId: id,
              data: {} // Não é necessário dados para exclusão
            });
            
            syncService.notifyAdmin(
              'Geradora excluída localmente', 
              `A geradora "${geradora.nome}" foi excluída localmente e será sincronizada quando o Supabase estiver disponível.`
            );
          } else {
            syncService.notifyAdmin(
              'Geradora excluída', 
              `A geradora "${geradora.nome}" foi excluída com sucesso.`
            );
          }
          
          return true;
        }
      }
      
      // Se chegou aqui, a geradora não foi encontrada no localStorage
      return false;
    } catch (error) {
      console.error(`Erro ao excluir geradora com ID ${id}:`, error);
      return false;
    }
  }
};
