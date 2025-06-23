import { Geradora } from '@/services/geradoraService';
import { createClientesFileForGeradora } from './init-local-clientes';

// Função para obter todas as geradoras do localStorage
export function getLocalGeradoras(): Geradora[] {
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (!geradorasSalvas) {
    return [];
  }
  
  try {
    return JSON.parse(geradorasSalvas);
  } catch (error) {
    console.error('Erro ao carregar geradoras do localStorage:', error);
    return [];
  }
}

// Função para adicionar uma nova geradora ao localStorage
export function addLocalGeradora(geradora: Partial<Geradora>): Geradora {
  const geradoras = getLocalGeradoras();
  
  // Criar nova geradora
  const now = new Date();
  const novaGeradora: Geradora = {
    id: `geradora-${Date.now()}`,
    nome: geradora.nome || 'Nova Geradora',
    email: geradora.email || `geradora_${Date.now()}@example.com`,
    dataCadastro: now.toISOString(),
    ...geradora,
    status: geradora.status || 'ativo'
  };
  
  // Adicionar à lista
  geradoras.push(novaGeradora);
  
  // Salvar no localStorage
  localStorage.setItem('geradoras', JSON.stringify(geradoras));
  
  // Criar um arquivo de clientes para a nova geradora
  createClientesFileForGeradora(novaGeradora.id, novaGeradora.nome);
  
  return novaGeradora;
}

// Função para atualizar uma geradora no localStorage
export function updateLocalGeradora(id: string, dados: Partial<Geradora>): Geradora | null {
  const geradoras = getLocalGeradoras();
  
  // Encontrar o índice da geradora
  const index = geradoras.findIndex(g => g.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Preservar a data de cadastro original
  const dataCadastroOriginal = geradoras[index].dataCadastro;
  
  // Atualizar dados
  const geradoraAtualizada: Geradora = {
    ...geradoras[index],
    ...dados,
    // Garantir que a data de cadastro seja preservada
    dataCadastro: dataCadastroOriginal
  };
  
  // Substituir na lista
  geradoras[index] = geradoraAtualizada;
  
  // Salvar no localStorage
  localStorage.setItem('geradoras', JSON.stringify(geradoras));
  
  return geradoraAtualizada;
}

// Função para remover uma geradora do localStorage
export function removeLocalGeradora(id: string): boolean {
  const geradoras = getLocalGeradoras();
  
  // Filtrar a geradora a ser removida
  const novasGeradoras = geradoras.filter(g => g.id !== id);
  
  if (novasGeradoras.length === geradoras.length) {
    return false;
  }
  
  // Salvar no localStorage
  localStorage.setItem('geradoras', JSON.stringify(novasGeradoras));
  
  return true;
}
