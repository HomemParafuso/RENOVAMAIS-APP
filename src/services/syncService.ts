import { supabase, checkSupabaseConnection } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Tipos de operações que podem ser armazenadas no outbox
export type OperationType = 'create' | 'update' | 'delete';

// Interface para uma operação pendente
export interface PendingOperation {
  id: string;
  timestamp: number;
  type: OperationType;
  table: string;
  data: Record<string, unknown>;
  entityId?: string;
}

// Chave para armazenar operações pendentes no localStorage
const PENDING_OPERATIONS_KEY = 'pendingOperations';
const SUPABASE_STATUS_KEY = 'supabaseStatus';

/**
 * Serviço para gerenciar a sincronização com o Supabase
 */
export const syncService = {
  /**
   * Verifica se o Supabase está disponível
   */
  async checkConnection(): Promise<boolean> {
    try {
      const isConnected = await checkSupabaseConnection();
      localStorage.setItem(SUPABASE_STATUS_KEY, isConnected ? 'online' : 'offline');
      return isConnected;
    } catch (error) {
      console.error('Erro ao verificar conexão com Supabase:', error);
      localStorage.setItem(SUPABASE_STATUS_KEY, 'offline');
      return false;
    }
  },

  /**
   * Retorna o status atual do Supabase
   */
  getStatus(): 'online' | 'offline' | 'unknown' {
    return (localStorage.getItem(SUPABASE_STATUS_KEY) as 'online' | 'offline') || 'unknown';
  },

  /**
   * Adiciona uma operação pendente ao outbox
   */
  addPendingOperation(operation: Omit<PendingOperation, 'id' | 'timestamp'>): void {
    const pendingOperations = this.getPendingOperations();
    
    const newOperation: PendingOperation = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...operation
    };
    
    pendingOperations.push(newOperation);
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(pendingOperations));
    
    // Notificar o administrador
    this.notifyAdmin('Operação armazenada localmente', `Uma operação ${operation.type} na tabela ${operation.table} foi armazenada localmente e será sincronizada quando o Supabase estiver disponível.`);
  },

  /**
   * Retorna todas as operações pendentes
   */
  getPendingOperations(): PendingOperation[] {
    try {
      const pendingOperations = localStorage.getItem(PENDING_OPERATIONS_KEY);
      return pendingOperations ? JSON.parse(pendingOperations) : [];
    } catch (error) {
      console.error('Erro ao obter operações pendentes:', error);
      return [];
    }
  },

  /**
   * Remove uma operação pendente do outbox
   */
  removePendingOperation(operationId: string): void {
    const pendingOperations = this.getPendingOperations();
    const updatedOperations = pendingOperations.filter(op => op.id !== operationId);
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(updatedOperations));
  },

  /**
   * Sincroniza todas as operações pendentes com o Supabase
   */
  async syncPendingOperations(): Promise<{ success: number; failed: number }> {
    const pendingOperations = this.getPendingOperations();
    let success = 0;
    let failed = 0;
    
    if (pendingOperations.length === 0) {
      return { success, failed };
    }
    
    // Verificar se o Supabase está disponível
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      this.notifyAdmin('Sincronização falhou', 'Não foi possível sincronizar as operações pendentes porque o Supabase está indisponível.');
      return { success, failed };
    }
    
    // Ordenar operações por timestamp (mais antigas primeiro)
    const sortedOperations = [...pendingOperations].sort((a, b) => a.timestamp - b.timestamp);
    
    for (const operation of sortedOperations) {
      try {
        switch (operation.type) {
          case 'create':
            await supabase.from(operation.table).insert(operation.data);
            break;
          case 'update':
            await supabase.from(operation.table).update(operation.data).eq('id', operation.entityId);
            break;
          case 'delete':
            await supabase.from(operation.table).delete().eq('id', operation.entityId);
            break;
        }
        
        // Remover operação sincronizada com sucesso
        this.removePendingOperation(operation.id);
        success++;
      } catch (error) {
        console.error(`Erro ao sincronizar operação ${operation.id}:`, error);
        failed++;
      }
    }
    
    if (success > 0) {
      this.notifyAdmin('Sincronização concluída', `${success} operações foram sincronizadas com sucesso. ${failed} operações falharam.`);
    }
    
    return { success, failed };
  },

  /**
   * Inicia a verificação periódica de conexão e sincronização
   */
  startPeriodicSync(intervalMs: number = 60000): NodeJS.Timeout {
    // Verificar conexão imediatamente
    this.checkConnection();
    
    // Configurar verificação periódica
    const intervalId = setInterval(async () => {
      const isConnected = await this.checkConnection();
      
      // Se estiver online e houver operações pendentes, sincronizar
      if (isConnected && this.getPendingOperations().length > 0) {
        await this.syncPendingOperations();
      }
    }, intervalMs);
    
    return intervalId;
  },

  /**
   * Para a verificação periódica
   */
  stopPeriodicSync(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
  },

  /**
   * Notifica o administrador sobre eventos importantes
   */
  notifyAdmin(title: string, message: string): void {
    // Armazenar notificação no localStorage para persistência
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push({
      id: Date.now(),
      title,
      message,
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    // Fora de um componente React, apenas logar
    console.warn(`[ADMIN NOTIFICATION] ${title}: ${message}`);
  }
};

// Hook para usar o serviço de sincronização em componentes React
export function useSyncService() {
  const { toast } = useToast();
  
  return {
    ...syncService,
    notifyAdmin: (title: string, message: string) => {
      // Armazenar notificação no localStorage para persistência
      const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      notifications.push({
        id: Date.now(),
        title,
        message,
        read: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
      
      // Mostrar toast
      toast({
        title,
        description: message,
        variant: 'destructive'
      });
    }
  };
}
