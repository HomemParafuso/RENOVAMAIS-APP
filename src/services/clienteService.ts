import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  auth
} from '@/lib/firebase';
import { syncService } from './syncService';
import { Cliente } from '@/portal-admin/types/cliente';

// Interface para um imóvel vinculado ao cliente
export interface Imovel {
  apelido: string;
  codigo: string;
  endereco: string;
}

// Interface para um cliente no Firestore
export interface ClienteFirestore {
  id: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  status: string;
  geradoraId: string;
  usinaId: string | null;
  dataCadastro: string;
  dataAtualizacao?: string;
  observacoes?: string;
  consumoMedio?: number;
  valorMedio?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string;
}

// Mantendo a interface ClienteApp para compatibilidade com código existente
export interface ClienteApp extends Cliente {
  // Campos adicionais para compatibilidade
  cpf?: string;
  tipoCalculo?: string;
  percentualEconomia?: number;
  fonteTarifa?: string;
  tusd?: number;
  te?: number;
  tipoIluminacao?: string;
  valorIluminacaoFixo?: number;
  valorIluminacaoPercentual?: number;
  usina?: string;
  dataAdesao?: string;
  dataCriacao?: string;
  imoveis?: Imovel[];
}

/**
 * Converte um documento do Firestore para o modelo Cliente da aplicação
 */
function mapFirestoreToCliente(doc: any): ClienteApp {
  const data = doc.data();
  return {
    id: doc.id,
    nome: data.nome,
    email: data.email,
    cpfCnpj: data.cpfCnpj || data.cpf || '',
    telefone: data.telefone,
    endereco: data.endereco || '',
    cidade: data.cidade || '',
    estado: data.estado || '',
    cep: data.cep || '',
    status: data.status,
    geradoraId: data.geradoraId || '',
    usinaId: data.usinaId || null,
    dataCadastro: data.dataCadastro || data.dataCriacao || '',
    dataAtualizacao: data.dataAtualizacao || '',
    observacoes: data.observacoes || '',
    consumoMedio: data.consumoMedio || 0,
    valorMedio: data.valorMedio || 0,
    
    // Campos para compatibilidade com código existente
    cpf: data.cpf || data.cpfCnpj || '',
    tipoCalculo: data.tipoCalculo || '',
    percentualEconomia: data.percentualEconomia || 0,
    fonteTarifa: data.fonteTarifa || '',
    tusd: data.tusd || 0,
    te: data.te || 0,
    tipoIluminacao: data.tipoIluminacao || '',
    valorIluminacaoFixo: data.valorIluminacaoFixo || 0,
    valorIluminacaoPercentual: data.valorIluminacaoPercentual || 0,
    usina: data.usina || '',
    dataAdesao: data.dataAdesao || '',
    dataCriacao: data.dataCriacao || data.dataCadastro || '',
    userId: data.userId,
    imoveis: data.imoveis || []
  };
}

/**
 * Serviço para gerenciar operações relacionadas aos clientes no Firebase
 */
export const clienteService = {
  /**
   * Busca clientes por ID da geradora
   */
  async getByGeradora(geradoraId: string): Promise<ClienteApp[]> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const clientesQuery = query(
            collection(db, 'clientes'),
            where('geradoraId', '==', geradoraId),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(clientesQuery);
          
          const clientes: ClienteApp[] = [];
          querySnapshot.forEach((doc) => {
            clientes.push(mapFirestoreToCliente(doc));
          });
          
          return clientes;
        } catch (firebaseError) {
          console.error(`Erro ao buscar clientes da geradora ${geradoraId} do Firebase:`, firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        try {
          const clientes = JSON.parse(clientesSalvos);
          return clientes.filter((c: any) => c.geradoraId === geradoraId);
        } catch (e) {
          console.error('Erro ao carregar clientes do localStorage:', e);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error(`Erro ao buscar clientes da geradora ${geradoraId}:`, error);
      return [];
    }
  },
  /**
   * Busca todos os clientes
   */
  async getAll(): Promise<ClienteApp[]> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const clientesQuery = query(
            collection(db, 'clientes'),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(clientesQuery);
          
          const clientes: ClienteApp[] = [];
          querySnapshot.forEach((doc) => {
            clientes.push(mapFirestoreToCliente(doc));
          });
          
          // Mesclar com clientes locais que ainda não foram sincronizados
          const clientesSalvos = localStorage.getItem('clientes');
          if (clientesSalvos) {
            const clientesLocais = JSON.parse(clientesSalvos);
            // Filtrar apenas clientes locais (IDs que não são strings)
            const apenasLocais = clientesLocais.filter((c: any) => typeof c.id === 'number');
            
            // Combinar clientes do Firebase com clientes locais
            const todosClientes = [...clientes, ...apenasLocais];
            
            // Atualizar localStorage com todos os clientes
            localStorage.setItem('clientes', JSON.stringify(todosClientes));
            
            return todosClientes;
          }
          
          // Se não houver clientes locais, salvar apenas os do Firebase no localStorage
          localStorage.setItem('clientes', JSON.stringify(clientes));
          
          return clientes;
        } catch (firebaseError) {
          console.error('Erro ao buscar clientes do Firebase:', firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        try {
          return JSON.parse(clientesSalvos);
        } catch (e) {
          console.error('Erro ao carregar clientes do localStorage:', e);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      
      // Último recurso: tentar o localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        try {
          return JSON.parse(clientesSalvos);
        } catch (e) {
          console.error('Erro ao carregar clientes do localStorage:', e);
        }
      }
      
      return [];
    }
  },

  /**
   * Busca um cliente pelo ID
   */
  async getById(id: string): Promise<ClienteApp | null> {
    try {
      // Se o ID não é uma string, é um cliente criado localmente
      if (typeof id !== 'string') {
        const clientesSalvos = localStorage.getItem('clientes');
        if (clientesSalvos) {
          try {
            const clientes = JSON.parse(clientesSalvos);
            const cliente = clientes.find((c: any) => c.id === id);
            if (cliente) {
              return cliente;
            }
          } catch (e) {
            console.error('Erro ao carregar clientes do localStorage:', e);
          }
        }
        return null;
      }
      
      // Para IDs que são strings, verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const docRef = doc(db, 'clientes', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cliente = mapFirestoreToCliente(docSnap);
            
            // Atualizar no localStorage também
            const clientesSalvos = localStorage.getItem('clientes');
            if (clientesSalvos) {
              const clientes = JSON.parse(clientesSalvos);
              const clientesAtualizados = clientes.map((c: any) => 
                c.id === id ? cliente : c
              );
              localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
            }
            
            return cliente;
          }
        } catch (firebaseError) {
          console.error(`Erro ao buscar cliente com ID ${id} do Firebase:`, firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        try {
          const clientes = JSON.parse(clientesSalvos);
          const cliente = clientes.find((c: any) => c.id === id);
          if (cliente) {
            return cliente;
          }
        } catch (e) {
          console.error('Erro ao carregar clientes do localStorage:', e);
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${id}:`, error);
      
      // Último recurso: tentar o localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        try {
          const clientes = JSON.parse(clientesSalvos);
          const cliente = clientes.find((c: any) => c.id === id);
          if (cliente) {
            return cliente;
          }
        } catch (e) {
          console.error('Erro ao carregar clientes do localStorage:', e);
        }
      }
      
      return null;
    }
  },

  /**
   * Cria um novo cliente
   */
  async create(cliente: Omit<ClienteApp, 'id'>): Promise<ClienteApp | null> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar salvar diretamente
        try {
          // Preparar dados para o Firestore
          const now = new Date();
          const firestoreData = {
            ...cliente,
            createdAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now),
            userId: auth.currentUser?.uid || null
          };
          
          // Referência para um novo documento com ID gerado automaticamente
          const clienteRef = doc(collection(db, 'clientes'));
          
          // Salvar no Firestore
          await setDoc(clienteRef, firestoreData);
          
          // Criar objeto do cliente com o ID gerado
          const novoCliente: ClienteApp = {
            ...cliente,
            id: clienteRef.id
          };
          
          // Salvar também no localStorage como fallback
          const clientes = await this.getAll();
          localStorage.setItem('clientes', JSON.stringify([...clientes, novoCliente]));
          
          syncService.notifyAdmin(
            'Cliente cadastrado no Firebase', 
            `O cliente "${cliente.nome}" foi cadastrado com sucesso no Firebase.`
          );
          
          return novoCliente;
        } catch (firebaseError) {
          console.error('Erro ao criar cliente no Firebase:', firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Firebase não estiver disponível ou falhar
      const novoCliente = {
        ...cliente,
        id: Date.now().toString() // ID temporário baseado em timestamp
      };
      
      // Salvar no localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      const clientes = clientesSalvos ? JSON.parse(clientesSalvos) : [];
      const novosClientes = [...clientes, novoCliente];
      localStorage.setItem('clientes', JSON.stringify(novosClientes));
      
      // Adicionar à fila de sincronização para quando o Firebase estiver disponível
      syncService.addPendingOperation({
        type: 'create',
        collection: 'clientes',
        data: {
          ...cliente,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          userId: auth.currentUser?.uid || null
        }
      });
      
      syncService.notifyAdmin(
        'Cliente cadastrado localmente', 
        `O cliente "${cliente.nome}" foi cadastrado com sucesso no modo local e será sincronizado quando o Firebase estiver disponível.`
      );
      
      return novoCliente;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return null;
    }
  },

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, cliente: Partial<ClienteApp>): Promise<ClienteApp | null> {
    try {
      // Se o ID não é uma string, é um cliente criado localmente
      if (typeof id !== 'string') {
        const clientesSalvos = localStorage.getItem('clientes');
        if (clientesSalvos) {
          const clientes = JSON.parse(clientesSalvos);
          const clientesAtualizados = clientes.map((c: any) => 
            c.id === id ? { ...c, ...cliente } : c
          );
          localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
          
          syncService.notifyAdmin(
            'Cliente local atualizado', 
            `O cliente "${cliente.nome}" foi atualizado com sucesso no modo local.`
          );
          
          return { ...cliente, id } as ClienteApp;
        }
        return null;
      }
      
      // Para IDs que são strings, verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar atualizar lá primeiro
        try {
          // Preparar dados para atualização
          const firestoreData = {
            ...cliente,
            updatedAt: Timestamp.now()
          };
          
          // Atualizar no Firestore
          const clienteRef = doc(db, 'clientes', id);
          await updateDoc(clienteRef, firestoreData);
          
          // Buscar o documento atualizado
          const docSnap = await getDoc(clienteRef);
          
          if (!docSnap.exists()) {
            throw new Error('Cliente não encontrado após atualização');
          }
          
          const clienteAtualizado = mapFirestoreToCliente(docSnap);
          
          // Atualizar também no localStorage como fallback
          const clientesSalvos = localStorage.getItem('clientes');
          if (clientesSalvos) {
            const clientes = JSON.parse(clientesSalvos);
            const clientesAtualizados = clientes.map((c: any) => 
              c.id === id ? clienteAtualizado : c
            );
            localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
          }
          
          syncService.notifyAdmin(
            'Cliente atualizado no Firebase', 
            `O cliente "${cliente.nome}" foi atualizado com sucesso no Firebase.`
          );
          
          return clienteAtualizado;
        } catch (firebaseError) {
          console.error(`Erro ao atualizar cliente com ID ${id} no Firebase:`, firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Firebase não estiver disponível ou falhar
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        const clientes = JSON.parse(clientesSalvos);
        const clienteExistente = clientes.find((c: any) => c.id === id);
        if (!clienteExistente) {
          return null;
        }
        
        const clienteAtualizado = { ...clienteExistente, ...cliente };
        const clientesAtualizados = clientes.map((c: any) => 
          c.id === id ? clienteAtualizado : c
        );
        localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
        
        // Adicionar à fila de sincronização
        syncService.addPendingOperation({
          type: 'update',
          collection: 'clientes',
          entityId: id,
          data: {
            ...cliente,
            updatedAt: Timestamp.now()
          }
        });
        
        syncService.notifyAdmin(
          'Cliente atualizado localmente', 
          `O cliente "${cliente.nome}" foi atualizado localmente e será sincronizado quando o Firebase estiver disponível.`
        );
        
        return clienteAtualizado;
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Exclui um cliente
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Primeiro, verificar se o cliente existe no localStorage
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        const clientes = JSON.parse(clientesSalvos);
        // Armazenar o cliente antes de excluí-lo para exibir o nome na notificação
        const cliente = clientes.find((c: any) => c.id === id);
        
        if (cliente) {
          // Remover do localStorage
          const clientesAtualizados = clientes.filter((c: any) => c.id !== id);
          localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
          
          // Se o ID não é uma string, é um cliente criado localmente
          if (typeof id !== 'string') {
            syncService.notifyAdmin(
              'Cliente excluído', 
              `O cliente "${cliente.nome}" foi excluído com sucesso.`
            );
            return true;
          }
          
          // Para IDs que são strings, verificar se o Firebase está disponível
          const isConnected = await syncService.checkConnection();
          
          if (isConnected) {
            // Se o Firebase estiver disponível, tentar excluir
            try {
              // Excluir do Firestore
              await deleteDoc(doc(db, 'clientes', id));
              
              syncService.notifyAdmin(
                'Cliente excluído no Firebase', 
                `O cliente "${cliente.nome}" foi excluído com sucesso do Firebase.`
              );
              
              return true;
            } catch (firebaseError) {
              console.error(`Erro ao excluir cliente do Firebase com ID ${id}:`, firebaseError);
              // Se falhar no Firebase, cair no fallback para exclusão apenas local
            }
          }
          
          // Se o Firebase não estiver disponível ou falhar, adicionar à fila de sincronização
          syncService.addPendingOperation({
            type: 'delete',
            collection: 'clientes',
            entityId: id,
            data: {} // Não é necessário dados para exclusão
          });
          
          syncService.notifyAdmin(
            'Cliente excluído localmente', 
            `O cliente "${cliente.nome}" foi excluído localmente e será sincronizado quando o Firebase estiver disponível.`
          );
          
          return true;
        }
      }
      
      // Se chegou aqui, o cliente não foi encontrado no localStorage
      return false;
    } catch (error) {
      console.error(`Erro ao excluir cliente com ID ${id}:`, error);
      return false;
    }
  }
};
