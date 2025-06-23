import React, { useEffect, useState } from 'react';
import { loadClientesFromFile, syncClientesToFile } from '@/lib/init-local-clientes';

/**
 * Componente para inicializar a sincronização de clientes
 * Este componente deve ser montado no início da aplicação para garantir
 * que os dados de clientes sejam carregados dos arquivos para o localStorage
 * e que as alterações sejam sincronizadas de volta para os arquivos.
 */
const ClienteSyncInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeClientes = async () => {
      try {
        console.log('[ClienteSyncInitializer] Inicializando sincronização de clientes...');
        
        // Carregar dados dos arquivos para o localStorage
        loadClientesFromFile();
        
        // Marcar como inicializado
        setInitialized(true);
        
        console.log('[ClienteSyncInitializer] Sincronização de clientes inicializada com sucesso.');
      } catch (error) {
        console.error('[ClienteSyncInitializer] Erro ao inicializar sincronização de clientes:', error);
      }
    };

    // Inicializar apenas uma vez
    if (!initialized) {
      initializeClientes();
    }

    // Configurar sincronização periódica
    const syncInterval = setInterval(() => {
      if (initialized) {
        console.log('[ClienteSyncInitializer] Executando sincronização periódica de clientes...');
        syncClientesToFile();
      }
    }, 5 * 60 * 1000); // Sincronizar a cada 5 minutos

    // Configurar sincronização antes de fechar a página
    const handleBeforeUnload = () => {
      if (initialized) {
        console.log('[ClienteSyncInitializer] Sincronizando clientes antes de fechar a página...');
        syncClientesToFile();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpar intervalos e event listeners
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [initialized]);

  // Este componente não renderiza nada visível
  return null;
};

export default ClienteSyncInitializer;
