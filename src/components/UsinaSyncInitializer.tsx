import { useEffect } from 'react';
import { getLocalUsinas } from '@/lib/init-local-usinas';

/**
 * Componente para inicializar o localStorage para usinas
 * Este componente não renderiza nada, apenas executa a lógica de inicialização
 */
const UsinaSyncInitializer = () => {
  useEffect(() => {
    // Verificar se o localStorage está disponível
    try {
      const usinas = getLocalUsinas();
      console.log('[Inicialização] Usinas carregadas do localStorage:', usinas.length);
    } catch (error) {
      console.error('[Inicialização] Erro ao carregar usinas do localStorage:', error);
    }

    // Configurar verificação periódica a cada 5 minutos
    const intervalId = setInterval(() => {
      try {
        const usinas = getLocalUsinas();
        console.log('[Verificação periódica] Usinas no localStorage:', usinas.length);
      } catch (error) {
        console.error('[Verificação periódica] Erro ao verificar usinas no localStorage:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos em milissegundos

    // Limpar o intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Este componente não renderiza nada
  return null;
};

export default UsinaSyncInitializer;
