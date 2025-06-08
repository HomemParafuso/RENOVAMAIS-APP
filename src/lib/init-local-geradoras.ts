import { Geradora } from '@/context/GeradoraAuthContext';

// Função para inicializar o banco de dados local com geradoras de exemplo
export function initLocalGeradoras() {
  // Verificar se já existem geradoras no localStorage
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (geradorasSalvas) {
    console.log('Geradoras já inicializadas no localStorage');
    return;
  }
  
  // Criar geradoras de exemplo
  const geradoras: Geradora[] = [
    {
      id: 'geradora-1',
      email: 'geradora1@exemplo.com',
      nome: 'Geradora Solar Ltda',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      cnpj: '12.345.678/0001-90',
      responsavel: 'João Silva',
      telefone: '(11) 98765-4321',
      endereco: 'Av. Paulista, 1000, São Paulo - SP',
      status: 'ativo'
    },
    {
      id: 'geradora-2',
      email: 'geradora2@exemplo.com',
      nome: 'Energia Renovável S.A.',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      cnpj: '98.765.432/0001-10',
      responsavel: 'Maria Oliveira',
      telefone: '(21) 98765-4321',
      endereco: 'Rua da Energia, 500, Rio de Janeiro - RJ',
      status: 'ativo'
    },
    {
      id: 'geradora-3',
      email: 'geradora3@exemplo.com',
      nome: 'Eco Energia Ltda',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      cnpj: '45.678.901/0001-23',
      responsavel: 'Carlos Santos',
      telefone: '(31) 98765-4321',
      endereco: 'Av. do Sol, 200, Belo Horizonte - MG',
      status: 'ativo'
    }
  ];
  
  // Salvar geradoras no localStorage
  localStorage.setItem('geradoras', JSON.stringify(geradoras));
  
  console.log('Geradoras inicializadas no localStorage:', geradoras);
}

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
export function addLocalGeradora(geradora: Omit<Geradora, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Geradora {
  const geradoras = getLocalGeradoras();
  
  // Criar nova geradora
  const novaGeradora: Geradora = {
    id: `geradora-${Date.now()}`,
    role: 'geradora',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'ativo',
    ...geradora
  };
  
  // Adicionar à lista
  geradoras.push(novaGeradora);
  
  // Salvar no localStorage
  localStorage.setItem('geradoras', JSON.stringify(geradoras));
  
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
  
  // Atualizar dados
  const geradoraAtualizada: Geradora = {
    ...geradoras[index],
    ...dados,
    updatedAt: new Date()
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
