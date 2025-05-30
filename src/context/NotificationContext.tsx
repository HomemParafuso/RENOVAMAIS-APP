import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/lib/supabase';

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  addNotification: (notification: { message: string; type: 'info' | 'warning' | 'error' | 'success'; user_id?: string; title?: string }) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    // Inscrever-se para mudanças em tempo real
    const subscription = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [...prev, payload.new as Notification]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((notification) =>
                notification.id === payload.new.id
                  ? (payload.new as Notification)
                  : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) =>
              prev.filter((notification) => notification.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    // TODO: Implementar RLS para SELECT na tabela notifications
    // Por enquanto, só busca se houver um usuário logado para evitar RLS errors iniciais
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return; // Não busca notificações se não houver usuário autenticado
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id) // Busca apenas notificações do usuário logado
        .order('created_at', { ascending: false });

      if (error) {
         console.error('Erro ao buscar notificações:', error);
         // Não adicionamos notificação de erro aqui para evitar loop
      }
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar notificações:', error);
       // Não adicionamos notificação de erro aqui
    } finally {
      setLoading(false);
    }
  };

  // Função melhorada para adicionar notificação
  const addNotification = async ({ message, type, user_id, title }: { message: string; type: 'info' | 'warning' | 'error' | 'success'; user_id?: string; title?: string }) => {
    try {
      // Verificar se há usuário autenticado
      const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
      
      // Determinar o user_id a ser usado
      let userIdToInsert: string | null = null;
      
      // Prioridade 1: Se user_id foi explicitamente fornecido, use-o
      if (user_id !== undefined) {
        userIdToInsert = user_id;
      } 
      // Prioridade 2: Se é uma notificação de erro, permitir user_id null
      else if (type === 'error') {
        userIdToInsert = null;
      } 
      // Prioridade 3: Se há usuário autenticado, use seu ID
      else if (authenticatedUser) {
        userIdToInsert = authenticatedUser.id;
      }
      // Prioridade 4: Se nenhuma das condições acima for atendida, não crie a notificação
      else {
        console.warn('Tentativa de adicionar notificação sem usuário autenticado e sem user_id fornecido.');
        return; // Sai da função sem tentar criar a notificação
      }

      // Usar um título genérico se não for fornecido
      const notificationTitle = title || 'Notificação';

      // Verificar se userIdToInsert é null e não é uma notificação de erro
      if (userIdToInsert === null && type !== 'error') {
        console.warn('Tentativa de adicionar notificação não-erro com user_id null. Isso violaria a restrição not-null.');
        return; // Sai da função sem tentar criar a notificação
      }

      // Agora tentamos a inserção com o userIdToInsert determinado
      const { error } = await supabase.from('notifications').insert([
        {
          title: notificationTitle,
          message,
          type,
          user_id: userIdToInsert,
          is_read: false,
        },
      ]);

      if (error) {
        console.error('Erro ao adicionar notificação:', error);
        // Registrar detalhes adicionais para depuração
        console.debug('Detalhes da notificação que falhou:', {
          title: notificationTitle,
          message,
          type,
          user_id: userIdToInsert
        });
      }
    } catch (error) {
      console.error('Erro inesperado ao adicionar notificação:', error);
    }
  };

  const removeNotification = async (id: string) => {
    // TODO: Implementar RLS para DELETE na tabela notifications
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.warn('Tentativa de remover notificação sem usuário autenticado.');
        return; // Não permite remover se não houver usuário
    }
    try {
        const { error } = await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id); // Apenas remove as próprias notificações
        if (error) throw error;
    } catch (error) {
        console.error('Erro ao remover notificação:', error);
    }
  };

  const markAsRead = async (id: string) => {
    // TODO: Implementar RLS para UPDATE na tabela notifications
    const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
        console.warn('Tentativa de marcar notificação como lida sem usuário autenticado.');
        return; // Não permite marcar como lida se não houver usuário
    }
    try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', user.id); // Apenas marca as próprias notificações
        if (error) throw error;
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
