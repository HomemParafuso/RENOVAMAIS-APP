import { createContext, useContext, useEffect, useState } from 'react';
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  auth
} from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Cliente } from '@/portal-admin/types/cliente'; // Importa a interface Cliente

interface ClienteContextType {
  clientes: Cliente[];
  loading: boolean;
  addCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro' | 'dataAtualizacao' | 'userId'>) => Promise<void>;
  updateCliente: (id: string, updates: Partial<Cliente>) => Promise<void>;
  removeCliente: (id: string) => Promise<void>;
  getClienteById: (id: string) => Promise<Cliente | undefined>;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export function ClienteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    if (user) {
      const clientesQuery = query(
        collection(db, 'clientes'),
        orderBy('dataCadastro', 'desc')
      );

      unsubscribeSnapshot = onSnapshot(clientesQuery, (snapshot) => {
        const clientesList: Cliente[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          clientesList.push({
            id: doc.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            cpfCnpj: data.cpfCnpj,
            endereco: data.endereco,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
            status: data.status,
            geradoraId: data.geradoraId,
            usinaId: data.usinaId || null,
            dataCadastro: data.dataCadastro,
            dataAtualizacao: data.dataAtualizacao || null,
            observacoes: data.observacoes || '',
            consumoMedio: data.consumoMedio || 0,
            valorMedio: data.valorMedio || 0,
            userId: data.userId || null,
          });
        });
        setClientes(clientesList);
        setLoading(false);
      }, (error) => {
        console.error("Erro ao buscar clientes: ", error);
        setLoading(false);
      });
    } else {
      setClientes([]);
      setLoading(false);
    }

    return () => {
      unsubscribeSnapshot();
    };
  }, [user]);

  const addCliente = async (cliente: Omit<Cliente, 'id' | 'dataCadastro' | 'dataAtualizacao' | 'userId'>) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      const now = Timestamp.now();
      await addDoc(collection(db, 'clientes'), {
        ...cliente,
        dataCadastro: now.toDate().toISOString(), // Converte para string ISO para consistência
        dataAtualizacao: now.toDate().toISOString(),
        userId: currentUser.uid, // Associa ao ID do usuário que o criou
      });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      throw error;
    }
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const clienteRef = doc(db, 'clientes', id);
      const clienteDoc = await getDoc(clienteRef);

      if (!clienteDoc.exists()) {
        throw new Error('Cliente não encontrado');
      }

      // Opcional: Adicionar verificação de userId se o cliente pertencer a um usuário específico
      // const clienteData = clienteDoc.data();
      // if (clienteData.userId !== currentUser.uid) {
      //   throw new Error('Você não tem permissão para atualizar este cliente');
      // }

      await updateDoc(clienteRef, {
        ...updates,
        dataAtualizacao: Timestamp.now().toDate().toISOString(), // Atualiza a data de atualização
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  };

  const removeCliente = async (id: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const clienteRef = doc(db, 'clientes', id);
      const clienteDoc = await getDoc(clienteRef);

      if (!clienteDoc.exists()) {
        throw new Error('Cliente não encontrado');
      }

      // Opcional: Adicionar verificação de userId
      // const clienteData = clienteDoc.data();
      // if (clienteData.userId !== currentUser.uid) {
      //   throw new Error('Você não tem permissão para remover este cliente');
      // }

      await deleteDoc(clienteRef);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  };

  const getClienteById = async (id: string) => {
    try {
      const clienteRef = doc(db, 'clientes', id);
      const clienteDoc = await getDoc(clienteRef);
      if (clienteDoc.exists()) {
        const data = clienteDoc.data();
        return {
          id: clienteDoc.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          cpfCnpj: data.cpfCnpj,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          status: data.status,
          geradoraId: data.geradoraId,
          usinaId: data.usinaId || null,
          dataCadastro: data.dataCadastro,
          dataAtualizacao: data.dataAtualizacao || null,
          observacoes: data.observacoes || '',
          consumoMedio: data.consumoMedio || 0,
          valorMedio: data.valorMedio || 0,
          userId: data.userId || null,
        } as Cliente;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return undefined;
    }
  };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        loading,
        addCliente,
        updateCliente,
        removeCliente,
        getClienteById,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  const context = useContext(ClienteContext);
  if (context === undefined) {
    throw new Error('useCliente deve ser usado dentro de um ClienteProvider');
  }
  return context;
} 