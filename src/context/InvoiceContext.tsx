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
  auth,
  Timestamp,
  Fatura
} from '@/lib/firebase';

interface InvoiceContextType {
  invoices: Fatura[];
  loading: boolean;
  addInvoice: (invoice: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: Fatura['status']) => Promise<void>;
  removeInvoice: (id: string) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário autenticado
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setInvoices([]);
        setLoading(false);
        return;
      }

      // Criar uma consulta para buscar faturas do usuário
      // Removendo o orderBy para evitar a necessidade de um índice composto
      const invoicesQuery = query(
        collection(db, 'faturas'),
        where('userId', '==', user.uid)
      );

      // Inscrever-se para mudanças em tempo real
      const unsubscribeSnapshot = onSnapshot(invoicesQuery, (snapshot) => {
        const invoicesList: Fatura[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          invoicesList.push({
            id: doc.id,
            userId: data.userId,
            amount: data.amount,
            dueDate: data.dueDate.toDate(),
            status: data.status,
            description: data.description,
            reference: data.reference,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          });
        });
        
        // Ordenar manualmente por data de criação (mais recentes primeiro)
        invoicesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setInvoices(invoicesList);
        setLoading(false);
      });

      return () => {
        unsubscribeSnapshot();
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const addInvoice = async (invoice: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      // Verificar se há usuário autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const now = new Date();
      
      // Adicionar fatura ao Firestore
      await addDoc(collection(db, 'faturas'), {
        userId: currentUser.uid,
        amount: invoice.amount,
        dueDate: Timestamp.fromDate(invoice.dueDate),
        status: invoice.status,
        description: invoice.description,
        reference: invoice.reference,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Erro ao adicionar fatura:', error);
      throw error;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Fatura['status']) => {
    try {
      // Verificar se há usuário autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a fatura pertence ao usuário atual
      const invoiceRef = doc(db, 'faturas', id);
      const invoiceDoc = await getDoc(invoiceRef);
      
      if (!invoiceDoc.exists()) {
        throw new Error('Fatura não encontrada');
      }
      
      const invoiceData = invoiceDoc.data();
      if (invoiceData.userId !== currentUser.uid) {
        throw new Error('Você não tem permissão para atualizar esta fatura');
      }
      
      // Atualizar o status da fatura
      await updateDoc(invoiceRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
      throw error;
    }
  };

  const removeInvoice = async (id: string) => {
    try {
      // Verificar se há usuário autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a fatura pertence ao usuário atual
      const invoiceRef = doc(db, 'faturas', id);
      const invoiceDoc = await getDoc(invoiceRef);
      
      if (!invoiceDoc.exists()) {
        throw new Error('Fatura não encontrada');
      }
      
      const invoiceData = invoiceDoc.data();
      if (invoiceData.userId !== currentUser.uid) {
        throw new Error('Você não tem permissão para remover esta fatura');
      }
      
      // Remover a fatura
      await deleteDoc(invoiceRef);
    } catch (error) {
      console.error('Erro ao remover fatura:', error);
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, loading, addInvoice, updateInvoiceStatus, removeInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice deve ser usado dentro de um InvoiceProvider');
  }
  return context;
}
