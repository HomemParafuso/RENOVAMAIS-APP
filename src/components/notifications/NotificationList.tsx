import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificationList() {
  const { notifications, loading, removeNotification, markAsRead } = useNotification();

  if (loading) {
    return <div>Carregando notificações...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Nenhuma notificação encontrada.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start justify-between rounded-lg border p-4 ${
              notification.read ? 'bg-muted/50' : 'bg-background'
            }`}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {notification.message}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como lida
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 