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
  Timestamp
} from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

// Definição do tipo de notificação
export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  userId?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  addNotification: (notification: { message: string; type: 'info' | 'warning' | 'error' | 'success'; userId?: string; title?: string }) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};
    
    // Usar o usuário do AuthContext
    if (user) {
      // Criar uma consulta para buscar notificações do usuário
      // Removendo o orderBy para evitar a necessidade de um índice composto
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', user.id)
      );

      // Inscrever-se para mudanças em tempo real
      unsubscribeSnapshot = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsList: Notification[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          notificationsList.push({
            id: doc.id,
            title: data.title,
            message: data.message,
            type: data.type,
            userId: data.userId,
            isRead: data.isRead,
            createdAt: data.createdAt.toDate()
          });
        });
        
        // Ordenar manualmente por data de criação (mais recentes primeiro)
        notificationsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setNotifications(notificationsList);
        setLoading(false);
      });
    } else {
      // Se não houver usuário, limpar as notificações
      setNotifications([]);
      setLoading(false);
    }

    return () => {
      unsubscribeSnapshot();
    };
  }, [user]); // Dependência no usuário do AuthContext

  // Função para adicionar notificação
  const addNotification = async ({ message, type, userId, title }: { message: string; type: 'info' | 'warning' | 'error' | 'success'; userId?: string; title?: string }) => {
    try {
      // Determinar o userId a ser usado
      let userIdToInsert: string | null = null;
      
      // Prioridade 1: Se userId foi explicitamente fornecido, use-o
      if (userId !== undefined) {
        userIdToInsert = userId;
      } 
      // Prioridade 2: Se é uma notificação de erro, permitir userId null
      else if (type === 'error') {
        userIdToInsert = null;
      } 
      // Prioridade 3: Se há usuário autenticado via AuthContext, use seu ID
      else if (user) {
        userIdToInsert = user.id;
      }
      // Prioridade 4: Se nenhuma das condições acima for atendida, não crie a notificação
      else {
        console.warn('Tentativa de adicionar notificação sem usuário autenticado e sem userId fornecido.');
        return; // Sai da função sem tentar criar a notificação
      }

      // Usar um título genérico se não for fornecido
      const notificationTitle = title || 'Notificação';

      // Verificar se userIdToInsert é null e não é uma notificação de erro
      if (userIdToInsert === null && type !== 'error') {
        console.warn('Tentativa de adicionar notificação não-erro com userId null.');
        return; // Sai da função sem tentar criar a notificação
      }

      // Agora tentamos a inserção com o userIdToInsert determinado
      await addDoc(collection(db, 'notifications'), {
        title: notificationTitle,
        message,
        type,
        userId: userIdToInsert,
        isRead: false,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro inesperado ao adicionar notificação:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      // Verificar se há usuário autenticado via AuthContext
      if (!user) {
        console.warn('Tentativa de remover notificação sem usuário autenticado.');
        return; // Não permite remover se não houver usuário
      }

      // Verificar se a notificação pertence ao usuário atual
      const notificationRef = doc(db, 'notifications', id);
      const notificationDoc = await getDoc(notificationRef);
      
      if (!notificationDoc.exists()) {
        console.warn('Tentativa de remover notificação inexistente.');
        return;
      }
      
      const notificationData = notificationDoc.data();
      if (notificationData.userId !== user.id) {
        console.warn('Tentativa de remover notificação de outro usuário.');
        return;
      }
      
      // Remover a notificação
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Verificar se há usuário autenticado via AuthContext
      if (!user) {
        console.warn('Tentativa de marcar notificação como lida sem usuário autenticado.');
        return; // Não permite marcar como lida se não houver usuário
      }

      // Verificar se a notificação pertence ao usuário atual
      const notificationRef = doc(db, 'notifications', id);
      const notificationDoc = await getDoc(notificationRef);
      
      if (!notificationDoc.exists()) {
        console.warn('Tentativa de marcar como lida uma notificação inexistente.');
        return;
      }
      
      const notificationData = notificationDoc.data();
      if (notificationData.userId !== user.id) {
        console.warn('Tentativa de marcar como lida uma notificação de outro usuário.');
        return;
      }
      
      // Marcar a notificação como lida
      await updateDoc(notificationRef, {
        isRead: true
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        addNotification,
        removeNotification,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
}
