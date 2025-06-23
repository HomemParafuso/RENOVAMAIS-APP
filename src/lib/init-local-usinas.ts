import { UsinaGeradora } from '@/portal-admin/types/usinaGeradora';

/**
 * Obtém a lista de usinas do localStorage
 */
export function getLocalUsinas(): UsinaGeradora[] {
  try {
    const usinasString = localStorage.getItem('usinas');
    if (usinasString) {
      return JSON.parse(usinasString);
    }
    return [];
  } catch (error) {
    console.error('Erro ao obter usinas do localStorage:', error);
    return [];
  }
}

/**
 * Adiciona uma nova usina ao localStorage
 */
export function addLocalUsina(usina: Partial<UsinaGeradora>): UsinaGeradora {
  try {
    const usinas = getLocalUsinas();
    
    // Gerar ID único se não fornecido
    const id = usina.id || `usina_${Date.now()}`;
    
    // Criar objeto usina com valores padrão
    const novaUsina: UsinaGeradora = {
      id,
      nome: usina.nome || 'Usina sem nome',
      geradoraId: usina.geradoraId || '',
      localizacao: usina.localizacao || '',
      capacidade: usina.capacidade || 0,
      status: usina.status || 'ativo',
      dataCadastro: usina.dataCadastro || new Date().toISOString(),
      dataAtualizacao: usina.dataAtualizacao || new Date().toISOString(),
      clientesVinculados: usina.clientesVinculados || 0,
      observacoes: usina.observacoes || ''
    };
    
    // Adicionar à lista
    usinas.push(novaUsina);
    
    // Salvar no localStorage
    localStorage.setItem('usinas', JSON.stringify(usinas));
    
    return novaUsina;
  } catch (error) {
    console.error('Erro ao adicionar usina ao localStorage:', error);
    throw error;
  }
}

/**
 * Atualiza uma usina existente no localStorage
 */
export function updateLocalUsina(id: string, updates: Partial<UsinaGeradora>): UsinaGeradora | null {
  try {
    const usinas = getLocalUsinas();
    
    // Encontrar o índice da usina
    const index = usinas.findIndex(u => u.id === id);
    
    if (index === -1) {
      console.error(`Usina com ID ${id} não encontrada`);
      return null;
    }
    
    // Atualizar a usina
    const usinaAtualizada: UsinaGeradora = {
      ...usinas[index],
      ...updates,
      dataAtualizacao: new Date().toISOString()
    };
    
    // Substituir no array
    usinas[index] = usinaAtualizada;
    
    // Salvar no localStorage
    localStorage.setItem('usinas', JSON.stringify(usinas));
    
    return usinaAtualizada;
  } catch (error) {
    console.error('Erro ao atualizar usina no localStorage:', error);
    return null;
  }
}

/**
 * Remove uma usina do localStorage
 */
export function removeLocalUsina(id: string): boolean {
  try {
    const usinas = getLocalUsinas();
    
    // Verificar se a usina existe
    const usinaExiste = usinas.some(u => u.id === id);
    
    if (!usinaExiste) {
      console.error(`Usina com ID ${id} não encontrada`);
      return false;
    }
    
    // Filtrar a usina a ser removida
    const usinasAtualizadas = usinas.filter(u => u.id !== id);
    
    // Salvar no localStorage
    localStorage.setItem('usinas', JSON.stringify(usinasAtualizadas));
    
    return true;
  } catch (error) {
    console.error('Erro ao remover usina do localStorage:', error);
    return false;
  }
}

/**
 * Inicializa o localStorage para usinas
 * Não inicializamos com dados de exemplo, apenas verificamos se o localStorage está disponível
 */
export function initLocalUsinas(): void {
  try {
    const usinas = getLocalUsinas();
    console.log(`Inicialização do localStorage para usinas concluída. ${usinas.length} usinas encontradas.`);
  } catch (error) {
    console.error('Erro ao inicializar localStorage para usinas:', error);
  }
}

// Verificar o localStorage ao importar o módulo
initLocalUsinas();
