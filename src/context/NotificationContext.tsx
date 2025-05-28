import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type Notification = Tables['notifications'];

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  addNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
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
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async ({ message, type }: { message: string; type: 'success' | 'error' }) => {
    const { error } = await supabase.from('notifications').insert([
      {
        message,
        type,
        read: false,
      },
    ]);

    if (error) throw error;
  };

  const removeNotification = async (id: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
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