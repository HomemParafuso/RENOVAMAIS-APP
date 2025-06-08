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
  auth,
  addDoc
} from '@/lib/firebase';
import { syncService } from './syncService';
import { UsinaGeradora } from '@/portal-admin/types/usinaGeradora';
import { Usina } from '@/portal-geradora/types/Usina';

/**
 * Converte um documento do Firestore para o modelo UsinaGeradora da aplicação
 */
function mapFirestoreToUsina(doc: any): UsinaGeradora {
  const data = doc.data();
  return {
    id: doc.id,
    nome: data.nome,
    potencia: data.potencia,
    localizacao: data.localizacao,
    endereco: data.endereco,
    codigoConsumidor: data.codigoConsumidor,
    email: data.email,
    senha: data.senha,
    cnpj: data.cnpj,
    status: data.status,
    clientesVinculados: data.clientesVinculados || 0,
    marcaInversor: data.marcaInversor,
    apiKey: data.apiKey,
    descricao: data.descricao,
    dataInstalacao: data.dataInstalacao,
    dataCadastro: data.dataCadastro,
    geradoraId: data.geradoraId
  };
}

class UsinaService {
  private collectionRef = collection(db, 'usinas');

  async getAll(): Promise<Usina[]> {
    const q = query(this.collectionRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Usina[];
  }

  async getUsinasByGeradoraId(geradoraId: string): Promise<Usina[]> {
    const q = query(this.collectionRef, where('geradoraId', '==', geradoraId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Usina[];
  }

  async getById(id: string): Promise<Usina | undefined> {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as Usina;
    }
    return undefined;
  }

  async add(usina: Omit<Usina, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usina> {
    const now = Timestamp.now();
    const docRef = await addDoc(this.collectionRef, {
      ...usina,
      createdAt: now,
      updatedAt: now,
    });
    const newUsina = {
      id: docRef.id,
      ...usina,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
    return newUsina;
  }

  async update(id: string, usina: Partial<Omit<Usina, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, {
      ...usina,
      updatedAt: Timestamp.now(),
    });
  }

  async remove(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }
}

export const usinaService = new UsinaService();

/**
 * Serviço para gerenciar operações relacionadas às usinas geradoras no Firebase
 */
export const usinaServiceFirebase = {
  /**
   * Busca todas as usinas
   */
  async getAll(): Promise<UsinaGeradora[]> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const usinasQuery = query(
            collection(db, 'usinas'),
            orderBy('dataCadastro', 'desc')
          );
          
          const querySnapshot = await getDocs(usinasQuery);
          
          const usinas: UsinaGeradora[] = [];
          querySnapshot.forEach((doc) => {
            usinas.push(mapFirestoreToUsina(doc));
          });
          
          // Mesclar com usinas locais que ainda não foram sincronizadas
          const usinasSalvas = localStorage.getItem('usinas');
          if (usinasSalvas) {
            const usinasLocais = JSON.parse(usinasSalvas);
            // Filtrar apenas usinas locais (IDs que não são strings)
            const apenasLocais = usinasLocais.filter((u: any) => typeof u.id === 'number');
            
            // Combinar usinas do Firebase com usinas locais
            const todasUsinas = [...usinas, ...apenasLocais];
            
            // Atualizar localStorage com todas as usinas
            localStorage.setItem('usinas', JSON.stringify(todasUsinas));
            
            return todasUsinas;
          }
          
          // Se não houver usinas locais, salvar apenas as do Firebase no localStorage
          localStorage.setItem('usinas', JSON.stringify(usinas));
          
          return usinas;
        } catch (firebaseError) {
          console.error('Erro ao buscar usinas do Firebase:', firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        try {
          return JSON.parse(usinasSalvas);
        } catch (e) {
          console.error('Erro ao carregar usinas do localStorage:', e);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar usinas:', error);
      
      // Último recurso: tentar o localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        try {
          return JSON.parse(usinasSalvas);
        } catch (e) {
          console.error('Erro ao carregar usinas do localStorage:', e);
        }
      }
      
      return [];
    }
  },

  /**
   * Busca usinas por ID da geradora
   */
  async getByGeradora(geradoraId: string): Promise<UsinaGeradora[]> {
    try {
      const todasUsinas = await this.getAll();
      return todasUsinas.filter(usina => usina.geradoraId === geradoraId);
    } catch (error) {
      console.error(`Erro ao buscar usinas da geradora ${geradoraId}:`, error);
      return [];
    }
  },

  /**
   * Busca uma usina pelo ID
   */
  async getById(id: string): Promise<UsinaGeradora | null> {
    try {
      // Se o ID não é uma string, é uma usina criada localmente
      if (typeof id !== 'string') {
        const usinasSalvas = localStorage.getItem('usinas');
        if (usinasSalvas) {
          try {
            const usinas = JSON.parse(usinasSalvas);
            const usina = usinas.find((u: any) => u.id === id);
            if (usina) {
              return usina;
            }
          } catch (e) {
            console.error('Erro ao carregar usinas do localStorage:', e);
          }
        }
        return null;
      }
      
      // Para IDs que são strings, verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar buscar de lá primeiro
        try {
          const docRef = doc(db, 'usinas', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const usina = mapFirestoreToUsina(docSnap);
            
            // Atualizar no localStorage também
            const usinasSalvas = localStorage.getItem('usinas');
            if (usinasSalvas) {
              const usinas = JSON.parse(usinasSalvas);
              const usinasAtualizadas = usinas.map((u: any) => 
                u.id === id ? usina : u
              );
              localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
            }
            
            return usina;
          }
        } catch (firebaseError) {
          console.error(`Erro ao buscar usina com ID ${id} do Firebase:`, firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        try {
          const usinas = JSON.parse(usinasSalvas);
          const usina = usinas.find((u: any) => u.id === id);
          if (usina) {
            return usina;
          }
        } catch (e) {
          console.error('Erro ao carregar usinas do localStorage:', e);
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar usina com ID ${id}:`, error);
      
      // Último recurso: tentar o localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        try {
          const usinas = JSON.parse(usinasSalvas);
          const usina = usinas.find((u: any) => u.id === id);
          if (usina) {
            return usina;
          }
        } catch (e) {
          console.error('Erro ao carregar usinas do localStorage:', e);
        }
      }
      
      return null;
    }
  },

  /**
   * Cria uma nova usina
   */
  async create(usina: Omit<UsinaGeradora, 'id'>): Promise<UsinaGeradora | null> {
    try {
      // Verificar se o Firebase está disponível
      const isConnected = await syncService.checkConnection();
      
      if (isConnected) {
        // Se o Firebase estiver disponível, tentar salvar diretamente
        try {
          // Preparar dados para o Firestore
          const now = new Date();
          const firestoreData = {
            ...usina,
            clientesVinculados: usina.clientesVinculados || 0,
            createdAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now)
          };
          
          // Referência para um novo documento com ID gerado automaticamente
          const usinaRef = doc(collection(db, 'usinas'));
          
          // Salvar no Firestore
          await setDoc(usinaRef, firestoreData);
          
          // Criar objeto da usina com o ID gerado
          const novaUsina: UsinaGeradora = {
            ...usina,
            id: usinaRef.id
          };
          
          // Salvar também no localStorage como fallback
          const usinas = await this.getAll();
          localStorage.setItem('usinas', JSON.stringify([...usinas, novaUsina]));
          
          syncService.notifyAdmin(
            'Usina cadastrada no Firebase', 
            `A usina "${usina.nome}" foi cadastrada com sucesso no Firebase.`
          );
          
          return novaUsina;
        } catch (firebaseError) {
          console.error('Erro ao criar usina no Firebase:', firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Firebase não estiver disponível ou falhar
      const novaUsina = {
        ...usina,
        id: Date.now().toString() // ID temporário baseado em timestamp
      };
      
      // Salvar no localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      const usinas = usinasSalvas ? JSON.parse(usinasSalvas) : [];
      const novasUsinas = [...usinas, novaUsina];
      localStorage.setItem('usinas', JSON.stringify(novasUsinas));
      
      // Adicionar à fila de sincronização para quando o Firebase estiver disponível
      syncService.addPendingOperation({
        type: 'create',
        collection: 'usinas',
        data: {
          ...usina,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
      });
      
      syncService.notifyAdmin(
        'Usina cadastrada localmente', 
        `A usina "${usina.nome}" foi cadastrada com sucesso no modo local e será sincronizada quando o Firebase estiver disponível.`
      );
      
      return novaUsina;
    } catch (error) {
      console.error('Erro ao criar usina:', error);
      return null;
    }
  },

  /**
   * Atualiza uma usina existente
   */
  async update(id: string, usina: Partial<UsinaGeradora>): Promise<UsinaGeradora | null> {
    try {
      // Se o ID não é uma string, é uma usina criada localmente
      if (typeof id !== 'string') {
        const usinasSalvas = localStorage.getItem('usinas');
        if (usinasSalvas) {
          const usinas = JSON.parse(usinasSalvas);
          const usinasAtualizadas = usinas.map((u: any) => 
            u.id === id ? { ...u, ...usina } : u
          );
          localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
          
          syncService.notifyAdmin(
            'Usina local atualizada', 
            `A usina "${usina.nome}" foi atualizada com sucesso no modo local.`
          );
          
          return { ...usina, id } as UsinaGeradora;
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
            ...usina,
            updatedAt: Timestamp.now()
          };
          
          // Atualizar no Firestore
          const usinaRef = doc(db, 'usinas', id);
          await updateDoc(usinaRef, firestoreData);
          
          // Buscar o documento atualizado
          const docSnap = await getDoc(usinaRef);
          
          if (!docSnap.exists()) {
            throw new Error('Usina não encontrada após atualização');
          }
          
          const usinaAtualizada = mapFirestoreToUsina(docSnap);
          
          // Atualizar também no localStorage como fallback
          const usinasSalvas = localStorage.getItem('usinas');
          if (usinasSalvas) {
            const usinas = JSON.parse(usinasSalvas);
            const usinasAtualizadas = usinas.map((u: any) => 
              u.id === id ? usinaAtualizada : u
            );
            localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
          }
          
          syncService.notifyAdmin(
            'Usina atualizada no Firebase', 
            `A usina "${usina.nome}" foi atualizada com sucesso no Firebase.`
          );
          
          return usinaAtualizada;
        } catch (firebaseError) {
          console.error(`Erro ao atualizar usina com ID ${id} no Firebase:`, firebaseError);
          // Se falhar no Firebase, cair no fallback para localStorage
        }
      }
      
      // Fallback para localStorage se o Firebase não estiver disponível ou falhar
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        const usinas = JSON.parse(usinasSalvas);
        const usinaExistente = usinas.find((u: any) => u.id === id);
        if (!usinaExistente) {
          return null;
        }
        
        const usinaAtualizada = { ...usinaExistente, ...usina };
        const usinasAtualizadas = usinas.map((u: any) => 
          u.id === id ? usinaAtualizada : u
        );
        localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
        
        // Adicionar à fila de sincronização
        syncService.addPendingOperation({
          type: 'update',
          collection: 'usinas',
          entityId: id,
          data: {
            ...usina,
            updatedAt: Timestamp.now()
          }
        });
        
        syncService.notifyAdmin(
          'Usina atualizada localmente', 
          `A usina "${usina.nome}" foi atualizada localmente e será sincronizada quando o Firebase estiver disponível.`
        );
        
        return usinaAtualizada;
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao atualizar usina com ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Exclui uma usina
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Primeiro, verificar se a usina existe no localStorage
      const usinasSalvas = localStorage.getItem('usinas');
      if (usinasSalvas) {
        const usinas = JSON.parse(usinasSalvas);
        // Armazenar a usina antes de excluí-la para exibir o nome na notificação
        const usina = usinas.find((u: any) => u.id === id);
        
        if (usina) {
          // Remover do localStorage
          const usinasAtualizadas = usinas.filter((u: any) => u.id !== id);
          localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
          
          // Se o ID não é uma string, é uma usina criada localmente
          if (typeof id !== 'string') {
            syncService.notifyAdmin(
              'Usina excluída', 
              `A usina "${usina.nome}" foi excluída com sucesso.`
            );
            return true;
          }
          
          // Para IDs que são strings, verificar se o Firebase está disponível
          const isConnected = await syncService.checkConnection();
          
          if (isConnected) {
            // Se o Firebase estiver disponível, tentar excluir
            try {
              // Excluir do Firestore
              await deleteDoc(doc(db, 'usinas', id));
              
              syncService.notifyAdmin(
                'Usina excluída no Firebase', 
                `A usina "${usina.nome}" foi excluída com sucesso do Firebase.`
              );
              
              return true;
            } catch (firebaseError) {
              console.error(`Erro ao excluir usina do Firebase com ID ${id}:`, firebaseError);
              // Se falhar no Firebase, cair no fallback para exclusão apenas local
            }
          }
          
          // Se o Firebase não estiver disponível ou falhar, adicionar à fila de sincronização
          syncService.addPendingOperation({
            type: 'delete',
            collection: 'usinas',
            entityId: id,
            data: {} // Não é necessário dados para exclusão
          });
          
          syncService.notifyAdmin(
            'Usina excluída localmente', 
            `A usina "${usina.nome}" foi excluída localmente e será sincronizada quando o Firebase estiver disponível.`
          );
          
          return true;
        }
      }
      
      // Se chegou aqui, a usina não foi encontrada no localStorage
      return false;
    } catch (error) {
      console.error(`Erro ao excluir usina com ID ${id}:`, error);
      return false;
    }
  }
};
