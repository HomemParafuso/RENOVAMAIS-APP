import { createContext, useContext, useEffect, useState } from 'react';
import { Usina } from '@/portal-geradora/types/Usina';
import { usinaService } from '@/services/usinaService';
import { useGeradoraAuth } from './GeradoraAuthContext'; // Para pegar o ID da geradora logada

interface UsinaContextType {
  usinas: Usina[];
  loading: boolean;
  addUsina: (usina: Omit<Usina, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUsina: (id: string, usina: Partial<Omit<Usina, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  removeUsina: (id: string) => Promise<void>;
  getUsinaById: (id: string) => Promise<Usina | undefined>;
}

const UsinaContext = createContext<UsinaContextType | undefined>(undefined);

export function UsinaProvider({ children }: { children: React.ReactNode }) {
  const { geradora, loading: geradoraAuthLoading } = useGeradoraAuth();
  const [usinas, setUsinas] = useState<Usina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const loadUsinas = async () => {
      if (!geradora?.id) {
        setUsinas([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Usar onSnapshot para atualizações em tempo real
        const fetchedUsinas = await usinaService.getUsinasByGeradoraId(geradora.id);
        setUsinas(fetchedUsinas);
      } catch (error) {
        console.error("Erro ao buscar usinas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!geradoraAuthLoading) {
      loadUsinas();
    }

    // TODO: Implementar onSnapshot se houver suporte no usinaService para real-time updates
    // Por enquanto, usaremos a busca única com useEffect

    return () => {
      // Limpar listener se onSnapshot for implementado
      if (unsubscribe) unsubscribe();
    };
  }, [geradora, geradoraAuthLoading]);

  const addUsina = async (usina: Omit<Usina, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!geradora?.id) {
      throw new Error('Geradora não autenticada ou ID ausente.');
    }
    await usinaService.add({ ...usina, geradoraId: geradora.id });
    // Recarregar usinas após adicionar para refletir a mudança
    const fetchedUsinas = await usinaService.getUsinasByGeradoraId(geradora.id);
    setUsinas(fetchedUsinas);
  };

  const updateUsina = async (id: string, usina: Partial<Omit<Usina, 'id' | 'createdAt' | 'updatedAt'>>) => {
    await usinaService.update(id, usina);
    // Recarregar usinas após atualizar
    const fetchedUsinas = await usinaService.getUsinasByGeradoraId(geradora!.id);
    setUsinas(fetchedUsinas);
  };

  const removeUsina = async (id: string) => {
    await usinaService.remove(id);
    // Recarregar usinas após remover
    const fetchedUsinas = await usinaService.getUsinasByGeradoraId(geradora!.id);
    setUsinas(fetchedUsinas);
  };

  const getUsinaById = async (id: string) => {
    return usinaService.getById(id);
  };

  return (
    <UsinaContext.Provider
      value={{
        usinas,
        loading,
        addUsina,
        updateUsina,
        removeUsina,
        getUsinaById,
      }}
    >
      {children}
    </UsinaContext.Provider>
  );
}

export function useUsina() {
  const context = useContext(UsinaContext);
  if (context === undefined) {
    throw new Error('useUsina deve ser usado dentro de um UsinaProvider');
  }
  return context;
} 