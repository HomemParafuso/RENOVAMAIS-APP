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
  Timestamp,
  auth,
  createUserWithEmailAndPassword,
  signOut
} from '@/lib/firebase';
import { Geradora } from '@/portal-admin/types';
import { syncService } from './syncService';

// Interface para uma geradora no Firestore
interface FirestoreGeradora {
  id: string;
  email: string;
  nome: string;
  role: 'geradora';
  isApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  parentId?: string;
  cnpj?: string;
  responsavel?: string;
  telefone?: string;
  endereco?: string;
  status?: 'ativo' | 'bloqueado' | 'pendente';
  planoCobranca?: {
    tipo: 'percentual' | 'fixo' | 'por_usuario' | 'misto';
    percentual?: number;
    valorFixo?: number;
    valorPorUsuario?: number;
  };
  limiteUsuarios?: number;
  usuariosAtivos?: number;
  ultimoPagamento?: Timestamp;
  [key: string]: any; // Adiciona a assinatura de índice
}

/**
 * Converte um documento do Firestore para o modelo Geradora da aplicação
 */
function mapFirestoreToGeradora(doc: FirestoreGeradora): Geradora {
  // Função auxiliar para converter Timestamp, Date ou string para ISO string
  const convertToISOString = (timestamp: Timestamp | Date | string | { seconds: number; nanoseconds: number } | undefined | null): string => {
    if (!timestamp) return new Date().toISOString();
    
    // Se for um Timestamp do Firestore (tem o método toDate)
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toISOString();
    }
    
    // Se for um objeto Date
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    // Se for uma string ISO
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    // Se for um objeto com segundos e nanossegundos (formato do Firestore)
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      const seconds = Number(timestamp.seconds);
      return new Date(seconds * 1000).toISOString();
    }
    
    // Fallback: retornar a data atual
    return new Date().toISOString();
  };

  return {
    id: doc.id,
    nome: doc.nome,
    email: doc.email,
    cnpj: doc.cnpj || '',
    responsavel: doc.responsavel || '',
    telefone: doc.telefone || '',
    endereco: doc.endereco || '',
    status: doc.status || 'pendente',
    planoCobranca: doc.planoCobranca ? {
      tipo: doc.planoCobranca.tipo,
      percentual: doc.planoCobranca.percentual,
      valorFixo: doc.planoCobranca.valorFixo,
      valorPorUsuario: doc.planoCobranca.valorPorUsuario
    } : {
      tipo: 'percentual',
      percentual: 5
    },
    limiteUsuarios: doc.limiteUsuarios || 10,
    usuariosAtivos: doc.usuariosAtivos || 0,
    dataCadastro: convertToISOString(doc.createdAt),
    ultimoPagamento: doc.ultimoPagamento ? convertToISOString(doc.ultimoPagamento) : undefined
  };
}

/**
 * Converte um objeto Geradora da aplicação para o formato do Firestore
 */
function mapGeradoraToFirestore(geradora: Partial<Geradora>): Partial<FirestoreGeradora> {
  const firestoreGeradora: Partial<FirestoreGeradora> = {
    nome: geradora.nome,
    email: geradora.email,
    role: 'geradora',
    cnpj: geradora.cnpj,
    responsavel: geradora.responsavel,
    telefone: geradora.telefone,
    endereco: geradora.endereco,
    status: geradora.status,
    planoCobranca: geradora.planoCobranca,
    limiteUsuarios: geradora.limiteUsuarios,
    usuariosAtivos: geradora.usuariosAtivos || 0
  };

  if (geradora.ultimoPagamento) {
    firestoreGeradora.ultimoPagamento = Timestamp.fromDate(new Date(geradora.ultimoPagamento));
  }

  return firestoreGeradora;
}

/**
 * Serviço para gerenciar operações relacionadas às geradoras no Firebase
 */
export const geradoraService = {
  /**
   * Busca todas as geradoras
   */
  async getAll(): Promise<Geradora[]> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const geradorasQuery = query(
            collection(db, 'users'),
            where('role', '==', 'geradora')
          );
          
          const querySnapshot = await getDocs(geradorasQuery);
          
          const geradoras: Geradora[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as FirestoreGeradora;
            data.id = doc.id;
            geradoras.push(mapFirestoreToGeradora(data));
          });
          
          // Mesclar com geradoras locais que ainda não foram sincronizadas
          const geradorasSalvas = localStorage.getItem('geradoras');
          if (geradorasSalvas) {
            const geradorasLocais = JSON.parse(geradorasSalvas);
            // Filtrar apenas geradoras locais (IDs que começam com "local-")
            const apenasLocais = geradorasLocais.filter((g: Geradora) => typeof g.id === 'string' && g.id.startsWith('local-'));
            
            // Combinar geradoras do Firebase com geradoras locais
            const todasGeradoras = [...geradoras, ...apenasLocais];
            
            // Atualizar localStorage com todas as geradoras
            localStorage.setItem('geradoras', JSON.stringify(todasGeradoras));
            
            return todasGeradoras;
          }
          
          // Se não houver geradoras locais, salvar apenas as do Firebase no localStorage
          localStorage.setItem('geradoras', JSON.stringify(geradoras));
          
          return geradoras;
        } catch (firebaseError) {
          console.error('Erro ao buscar geradoras do Firebase:', firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
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
          return [];
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
      const isConnected = await syncService.checkConnection();
      if (isConnected) {
        try {
          const docRef = doc(db, 'users', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === 'geradora') {
            const data = docSnap.data() as FirestoreGeradora;
            data.id = docSnap.id;
            return mapFirestoreToGeradora(data);
          }
        } catch (firebaseError) {
          console.error('Erro ao buscar geradora por ID do Firebase:', firebaseError);
        }
      }
      // Fallback para localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        const geradorasLocais = JSON.parse(geradorasSalvas);
        return geradorasLocais.find((g: Geradora) => g.id === id) || null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar geradora por ID:', error);
      return null;
    }
  },

  /**
   * Verifica se o usuário autenticado tem permissões de administrador
   */
  async checkFirebasePermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const idTokenResult = await user.getIdTokenResult(true);
            resolve(!!idTokenResult.claims.admin);
          } catch (error) {
            console.error("Erro ao obter claims do token:", error);
            resolve(false);
          }
        } else {
          resolve(false);
        }
        unsubscribe(); 
      });
    });
  },

  /**
   * Cria uma nova geradora no Firebase e um usuário correspondente
   */
  async create(geradora: Omit<Geradora, 'id'> & { senha?: string }): Promise<Geradora | null> {
    try {
      const isConnected = await syncService.checkConnection();
      if (!isConnected) {
        // Se não houver conexão, criar uma geradora localmente
        const newLocalGeradora = {
          ...geradora,
          id: `local-${Date.now()}`,
          dataCadastro: new Date().toISOString(),
          status: geradora.status || 'pendente',
          usuariosAtivos: 0
        };
        const geradorasSalvas = localStorage.getItem('geradoras');
        const geradoras = geradorasSalvas ? JSON.parse(geradorasSalvas) : [];
        localStorage.setItem('geradoras', JSON.stringify([...geradoras, newLocalGeradora]));
        return newLocalGeradora;
      }

      const { email, senha, ...rest } = geradora;
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios para criar uma geradora.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;
      const now = Timestamp.now();

      const newFirestoreGeradora: FirestoreGeradora = {
        id: userId,
        email,
        nome: rest.nome,
        role: 'geradora',
        isApproved: false, // Geradoras inicialmente não aprovadas
        createdAt: now,
        updatedAt: now,
        cnpj: rest.cnpj || '',
        responsavel: rest.responsavel || '',
        telefone: rest.telefone || '',
        endereco: rest.endereco || '',
        status: rest.status || 'pendente',
        planoCobranca: rest.planoCobranca || {
          tipo: 'percentual',
          percentual: 5
        },
        limiteUsuarios: rest.limiteUsuarios || 10,
        usuariosAtivos: 0
      };

      await setDoc(doc(db, 'users', userId), newFirestoreGeradora);

      // Adicionar aos dados locais e sincronizar
      const geradorasSalvas = localStorage.getItem('geradoras');
      const geradoras = geradorasSalvas ? JSON.parse(geradorasSalvas) : [];
      const novaGeradoraLocal = mapFirestoreToGeradora(newFirestoreGeradora);
      localStorage.setItem('geradoras', JSON.stringify([...geradoras, novaGeradoraLocal]));
      syncService.addPendingOperation({ type: 'create', collection: 'geradoras', entityId: userId, data: newFirestoreGeradora });

      return novaGeradoraLocal;
    } catch (error: any) {
      console.error('Erro ao criar geradora:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('O email fornecido já está em uso.');
      }
      throw error;
    }
  },

  /**
   * Atualiza uma geradora existente
   */
  async update(geradora: Geradora): Promise<Geradora | null> {
    try {
      const isConnected = await syncService.checkConnection();
      if (!isConnected) {
        // Se não houver conexão, atualizar localmente
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const updatedGeradoras = geradoras.map((g: Geradora) =>
            g.id === geradora.id ? { ...g, ...geradora, dataCadastro: g.dataCadastro } : g
          );
          localStorage.setItem('geradoras', JSON.stringify(updatedGeradoras));
          return updatedGeradoras.find((g: Geradora) => g.id === geradora.id) || null;
        }
        return null;
      }

      const geradoraRef = doc(db, 'users', geradora.id);
      const firestoreData = mapGeradoraToFirestore(geradora);
      
      await updateDoc(geradoraRef, {
        ...firestoreData,
        updatedAt: Timestamp.now(),
      });

      // Atualizar dados locais e sincronizar
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        const geradoras = JSON.parse(geradorasSalvas);
        const updatedGeradoras = geradoras.map((g: Geradora) =>
          g.id === geradora.id ? { ...g, ...geradora, dataCadastro: g.dataCadastro } : g
        );
        localStorage.setItem('geradoras', JSON.stringify(updatedGeradoras));
      }
      syncService.addPendingOperation({ type: 'update', collection: 'geradoras', entityId: geradora.id, data: firestoreData });

      return geradora;
    } catch (error) {
      console.error('Erro ao atualizar geradora:', error);
      throw error;
    }
  },

  /**
   * Deleta uma geradora existente
   */
  async delete(id: string): Promise<boolean> {
    try {
      const isConnected = await syncService.checkConnection();
      if (!isConnected) {
        // Se não houver conexão, deletar localmente
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const filteredGeradoras = geradoras.filter((g: Geradora) => g.id !== id);
          localStorage.setItem('geradoras', JSON.stringify(filteredGeradoras));
          return true;
        }
        return false;
      }

      await deleteDoc(doc(db, 'users', id));

      // Remover dos dados locais e sincronizar
      const geradorasSalvas = localStorage.getItem('geradoras');
      if (geradorasSalvas) {
        const geradoras = JSON.parse(geradorasSalvas);
        const filteredGeradoras = geradoras.filter((g: Geradora) => g.id !== id);
        localStorage.setItem('geradoras', JSON.stringify(filteredGeradoras));
      }
      syncService.addPendingOperation({ type: 'delete', collection: 'geradoras', entityId: id, data: {} });

      return true;
    } catch (error) {
      console.error('Erro ao deletar geradora:', error);
      throw error;
    }
  },

  async signOutGeradora(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('geradoras');
      localStorage.removeItem('currentUser');
      // Você pode querer limpar outros estados ou caches relevantes aqui
    } catch (error) {
      console.error("Erro ao fazer logout da geradora:", error);
      throw error;
    }
  }
}; 