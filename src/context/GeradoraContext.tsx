import { createContext, useContext, useEffect, useState } from 'react';
import {
  db,
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  auth,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp
} from '@/lib/firebase';
import { useAuth } from './AuthContext'; // Certifique-se de que o useAuth está disponível para pegar o user.uid

export interface Geradora {
  id: string;
  nome: string;
  status: 'ativo' | 'inativo' | 'pendente';
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // Opcional, se a geradora puder não estar ligada a um usuário específico
}

interface GeradoraContextType {
  geradoras: Geradora[];
  loading: boolean;
  addGeradora: (geradora: Omit<Geradora, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateGeradoraStatus: (id: string, status: Geradora['status']) => Promise<void>;
  removeGeradora: (id: string) => Promise<void>;
  getGeradoraById: (id: string) => Promise<Geradora | undefined>;
}

const GeradoraContext = createContext<GeradoraContextType | undefined>(undefined);

export function GeradoraProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Obter o usuário do AuthContext
  const [geradoras, setGeradoras] = useState<Geradora[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    if (user) {
      const geradorasQuery = query(
        collection(db, 'geradoras'),
        orderBy('createdAt', 'desc') // Ordenar por data de criação
      );

      unsubscribeSnapshot = onSnapshot(geradorasQuery, (snapshot) => {
        const geradorasList: Geradora[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          geradorasList.push({
            id: doc.id,
            nome: data.nome,
            status: data.status,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            userId: data.userId,
          });
        });
        setGeradoras(geradorasList);
        setLoading(false);
      }, (error) => {
        console.error("Erro ao buscar geradoras: ", error);
        setLoading(false);
      });
    } else {
      setGeradoras([]);
      setLoading(false);
    }

    return () => {
      unsubscribeSnapshot();
    };
  }, [user]);

  const addGeradora = async (geradora: Omit<Geradora, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const now = Timestamp.now();
      await addDoc(collection(db, 'geradoras'), {
        ...geradora,
        createdAt: now,
        updatedAt: now,
        userId: currentUser.uid,
      });
    } catch (error) {
      console.error('Erro ao adicionar geradora:', error);
      throw error;
    }
  };

  const updateGeradoraStatus = async (id: string, status: Geradora['status']) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const geradoraRef = doc(db, 'geradoras', id);
      const geradoraDoc = await getDoc(geradoraRef);

      if (!geradoraDoc.exists()) {
        throw new Error('Geradora não encontrada');
      }

      const geradoraData = geradoraDoc.data();
      // Opcional: Adicione verificação de userId se cada geradora pertencer a um único usuário
      // if (geradoraData.userId !== currentUser.uid) {
      //   throw new Error('Você não tem permissão para atualizar esta geradora');
      // }

      await updateDoc(geradoraRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar status da geradora:', error);
      throw error;
    }
  };

  const removeGeradora = async (id: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const geradoraRef = doc(db, 'geradoras', id);
      const geradoraDoc = await getDoc(geradoraRef);

      if (!geradoraDoc.exists()) {
        throw new Error('Geradora não encontrada');
      }

      const geradoraData = geradoraDoc.data();
      // Opcional: Adicione verificação de userId se cada geradora pertencer a um único usuário
      // if (geradoraData.userId !== currentUser.uid) {
      //   throw new Error('Você não tem permissão para remover esta geradora');
      // }

      await deleteDoc(geradoraRef);
    } catch (error) {
      console.error('Erro ao remover geradora:', error);
      throw error;
    }
  };

  const getGeradoraById = async (id: string) => {
    try {
      const geradoraRef = doc(db, 'geradoras', id);
      const geradoraDoc = await getDoc(geradoraRef);
      if (geradoraDoc.exists()) {
        const data = geradoraDoc.data();
        return {
          id: geradoraDoc.id,
          nome: data.nome,
          status: data.status,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          userId: data.userId,
        } as Geradora;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar geradora por ID:', error);
      return undefined;
    }
  };

  return (
    <GeradoraContext.Provider
      value={{
        geradoras,
        loading,
        addGeradora,
        updateGeradoraStatus,
        removeGeradora,
        getGeradoraById,
      }}
    >
      {children}
    </GeradoraContext.Provider>
  );
}

export function useGeradora() {
  const context = useContext(GeradoraContext);
  if (context === undefined) {
    throw new Error('useGeradora deve ser usado dentro de um GeradoraProvider');
  }
  return context;
} 