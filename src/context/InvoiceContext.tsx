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
  Fatura,
  faturaToFirestore,
  uploadFile,
  deleteFile
} from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface InvoiceContextType {
  invoices: Fatura[];
  loading: boolean;
  addInvoice: (invoice: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'pdfUrl'>, pdfFile?: File | null) => Promise<void>;
  updateInvoiceStatus: (id: string, status: Fatura['status'], dataStatus?: Date) => Promise<void>;
  updateInvoice: (id: string, updatedFields: Partial<Fatura>) => Promise<void>;
  removeInvoice: (id: string) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Esperar a autenticação carregar

    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    // Criar uma consulta para buscar faturas do usuário
    const invoicesQuery = query(
      collection(db, 'users', user.id, 'invoices'),
      where('userId', '==', user.id)
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
          valorTotalExtraido: data.valorTotalExtraido,
          leituraAnterior: data.leituraAnterior,
          leituraAtual: data.leituraAtual,
          codigoConcessionaria: data.codigoConcessionaria,
          dataStatus: data.dataStatus ? data.dataStatus.toDate() : undefined,
          pdfUrl: data.pdfUrl,
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
  }, [authLoading, user]);

  const addInvoice = async (invoice: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'pdfUrl'>, pdfFile?: File | null) => {
    try {
      // Verificar se há usuário autenticado
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const now = new Date();
      let pdfUrl: string | undefined = undefined;

      // Adicionar um novo documento para obter um ID antes de fazer o upload do arquivo
      const docRef = doc(collection(db, 'users', user.id, 'invoices'));

      if (pdfFile) {
        // Caminho no Storage: users/{userId}/invoices/{invoiceId}.pdf
        const storagePath = `users/${user.id}/invoices/${docRef.id}.pdf`;
        pdfUrl = await uploadFile(pdfFile, storagePath);
      }
      
      // Adicionar fatura ao Firestore
      await addDoc(collection(db, 'users', user.id, 'invoices'), {
        userId: user.id,
        amount: invoice.amount,
        dueDate: Timestamp.fromDate(invoice.dueDate),
        status: invoice.status,
        description: invoice.description,
        reference: invoice.reference,
        valorTotalExtraido: invoice.valorTotalExtraido,
        leituraAnterior: invoice.leituraAnterior,
        leituraAtual: invoice.leituraAtual,
        codigoConcessionaria: invoice.codigoConcessionaria,
        dataStatus: invoice.dataStatus ? Timestamp.fromDate(invoice.dataStatus) : undefined,
        pdfUrl: pdfUrl,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Erro ao adicionar fatura:', error);
      throw error;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Fatura['status'], dataStatus?: Date) => {
    try {
      // Verificar se há usuário autenticado
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a fatura pertence ao usuário atual
      const invoiceRef = doc(db, 'users', user.id, 'invoices', id);
      const invoiceDoc = await getDoc(invoiceRef);
      
      if (!invoiceDoc.exists()) {
        throw new Error('Fatura não encontrada');
      }
      
      const invoiceData = invoiceDoc.data();
      if (invoiceData.userId !== user.id) {
        throw new Error('Você não tem permissão para atualizar esta fatura');
      }
      
      // Atualizar o status da fatura
      await updateDoc(invoiceRef, {
        status,
        updatedAt: Timestamp.now(),
        dataStatus: dataStatus ? Timestamp.fromDate(dataStatus) : undefined,
      });
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, updatedFields: Partial<Fatura>) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const invoiceRef = doc(db, 'users', user.id, 'invoices', id);
      const invoiceDoc = await getDoc(invoiceRef);

      if (!invoiceDoc.exists()) {
        throw new Error('Fatura não encontrada');
      }

      const invoiceData = invoiceDoc.data();
      if (invoiceData.userId !== user.id) {
        throw new Error('Você não tem permissão para atualizar esta fatura');
      }

      const dataToUpdate = faturaToFirestore({
        ...updatedFields,
        updatedAt: new Date()
      });

      await updateDoc(invoiceRef, dataToUpdate);
    } catch (error) {
      console.error('Erro ao atualizar fatura:', error);
      throw error;
    }
  };

  const removeInvoice = async (id: string) => {
    try {
      // Verificar se há usuário autenticado
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a fatura pertence ao usuário atual
      const invoiceRef = doc(db, 'users', user.id, 'invoices', id);
      const invoiceDoc = await getDoc(invoiceRef);
      
      if (!invoiceDoc.exists()) {
        throw new Error('Fatura não encontrada');
      }
      
      const invoiceData = invoiceDoc.data();
      if (invoiceData.userId !== user.id) {
        throw new Error('Você não tem permissão para remover esta fatura');
      }

      // Se a fatura tiver um PDF associado, tentar excluí-lo do Storage
      if (invoiceData.pdfUrl) {
        try {
          await deleteFile(invoiceData.pdfUrl);
          console.log('PDF excluído do Storage com sucesso.');
        } catch (storageError) {
          console.warn('Erro ao excluir PDF do Storage (pode não existir):', storageError);
          // Continuar mesmo se a exclusão do Storage falhar, pois o documento do Firestore é mais importante
        }
      }

      // Remover a fatura do Firestore
      await deleteDoc(invoiceRef);
    } catch (error) {
      console.error('Erro ao remover fatura:', error);
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, loading, addInvoice, updateInvoiceStatus, updateInvoice, removeInvoice }}
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
