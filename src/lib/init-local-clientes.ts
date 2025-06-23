import { ClienteApp } from '@/services/clienteService';

/**
 * Versão do navegador - não usa fs e path
 */

// Interface para o módulo server-storage
interface ServerStorage {
  ensureDirectoryExists: (dirPath: string) => void;
  readJsonFile: <T>(filePath: string) => T | null;
  writeJsonFile: <T>(filePath: string, data: T) => boolean;
  listFiles: (dirPath: string) => string[];
  fileExists: (filePath: string) => boolean;
  removeFile: (filePath: string) => boolean;
}

// Importação condicional para o servidor
let serverStorage: ServerStorage | null = null;
try {
  // Tentar importar o módulo server-storage apenas no ambiente de servidor
  if (typeof window === 'undefined') {
    // Usando dynamic import para evitar require()
    import('./server-storage').then(module => {
      serverStorage = module as unknown as ServerStorage;
    }).catch(() => {
      console.log('Erro ao importar server-storage');
    });
  }
} catch (error) {
  console.log('Executando em ambiente de navegador, server-storage não disponível');
}

/**
 * Obtém a lista de clientes do localStorage para uma geradora específica
 * @param geradoraId ID da geradora
 */
export function getLocalClientes(geradoraId?: string): ClienteApp[] {
  try {
    if (geradoraId) {
      // Obter clientes específicos da geradora
      const clientesString = localStorage.getItem(`clientes_${geradoraId}`);
      if (clientesString) {
        return JSON.parse(clientesString);
      }
      return [];
    } else {
      // Obter todos os clientes (para admin)
      // Primeiro, obter todas as chaves do localStorage que começam com "clientes_"
      const allClientes: ClienteApp[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('clientes_')) {
          const clientesString = localStorage.getItem(key);
          if (clientesString) {
            const clientesArray = JSON.parse(clientesString);
            allClientes.push(...clientesArray);
          }
        }
      }
      return allClientes;
    }
  } catch (error) {
    console.error('Erro ao obter clientes do localStorage:', error);
    return [];
  }
}

/**
 * Adiciona um novo cliente ao localStorage para uma geradora específica
 */
export function addLocalCliente(cliente: Partial<ClienteApp>): ClienteApp {
  try {
    if (!cliente.geradoraId) {
      throw new Error('geradoraId é obrigatório para adicionar um cliente');
    }
    
    const geradoraId = cliente.geradoraId;
    const clientes = getLocalClientes(geradoraId);
    
    // Gerar ID único se não fornecido
    const id = cliente.id || `cliente_${Date.now()}`;
    
    // Criar objeto cliente com valores padrão
    const novoCliente: ClienteApp = {
      id,
      nome: cliente.nome || 'Cliente sem nome',
      email: cliente.email || `cliente_${id}@example.com`,
      cpfCnpj: cliente.cpfCnpj || '',
      telefone: cliente.telefone || '',
      endereco: cliente.endereco || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || '',
      cep: cliente.cep || '',
      status: cliente.status || 'ativo',
      geradoraId: geradoraId,
      usinaId: cliente.usinaId || null,
      dataCadastro: cliente.dataCadastro || new Date().toISOString(),
      dataAtualizacao: cliente.dataAtualizacao || new Date().toISOString(),
      observacoes: cliente.observacoes || '',
      consumoMedio: cliente.consumoMedio || 0,
      valorMedio: cliente.valorMedio || 0,
      cpf: cliente.cpf || cliente.cpfCnpj || '',
      imoveis: cliente.imoveis || []
    };
    
    // Adicionar à lista
    clientes.push(novoCliente);
    
    // Salvar no localStorage específico da geradora
    localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify(clientes));
    
    // Salvar no arquivo físico (se estiver no servidor)
    saveClienteToFile(novoCliente);
    
    // Registrar no console
    console.log(`[Simulação] Cliente adicionado para a geradora ${geradoraId}`);
    
    return novoCliente;
  } catch (error) {
    console.error('Erro ao adicionar cliente ao localStorage:', error);
    throw error;
  }
}

/**
 * Atualiza um cliente existente no localStorage
 */
export function updateLocalCliente(id: string, updates: Partial<ClienteApp>): ClienteApp | null {
  try {
    // Primeiro, precisamos encontrar em qual geradora o cliente está
    let clienteEncontrado: ClienteApp | null = null;
    let geradoraId: string | null = null;
    
    // Verificar se o geradoraId foi fornecido nas atualizações
    if (updates.geradoraId) {
      geradoraId = updates.geradoraId;
      const clientes = getLocalClientes(geradoraId);
      clienteEncontrado = clientes.find(c => c.id === id) || null;
    } else {
      // Procurar em todas as geradoras
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('clientes_')) {
          const clientesString = localStorage.getItem(key);
          if (clientesString) {
            const clientesArray = JSON.parse(clientesString);
            const cliente = clientesArray.find((c: ClienteApp) => c.id === id);
            if (cliente) {
              clienteEncontrado = cliente;
              geradoraId = key.replace('clientes_', '');
              break;
            }
          }
        }
      }
    }
    
    if (!clienteEncontrado || !geradoraId) {
      console.error(`Cliente com ID ${id} não encontrado`);
      return null;
    }
    
    // Obter a lista de clientes da geradora
    const clientes = getLocalClientes(geradoraId);
    
    // Encontrar o índice do cliente
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
      console.error(`Cliente com ID ${id} não encontrado na geradora ${geradoraId}`);
      return null;
    }
    
    // Atualizar o cliente
    const clienteAtualizado: ClienteApp = {
      ...clientes[index],
      ...updates,
      dataAtualizacao: new Date().toISOString()
    };
    
    // Substituir no array
    clientes[index] = clienteAtualizado;
    
    // Salvar no localStorage específico da geradora
    localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify(clientes));
    
    // Atualizar no arquivo físico (se estiver no servidor)
    saveClienteToFile(clienteAtualizado);
    
    // Registrar no console
    console.log(`[Simulação] Cliente atualizado para a geradora ${geradoraId}`);
    
    return clienteAtualizado;
  } catch (error) {
    console.error('Erro ao atualizar cliente no localStorage:', error);
    return null;
  }
}

/**
 * Remove um cliente do localStorage
 */
export function removeLocalCliente(id: string, geradoraId?: string): boolean {
  try {
    let clienteRemovido = false;
    let geradoraDoCliente = geradoraId;
    
    // Se o geradoraId foi fornecido, procurar apenas nessa geradora
    if (geradoraId) {
      const clientes = getLocalClientes(geradoraId);
      
      // Verificar se o cliente existe
      const clienteExiste = clientes.some(c => c.id === id);
      
      if (!clienteExiste) {
        console.error(`Cliente com ID ${id} não encontrado na geradora ${geradoraId}`);
        return false;
      }
      
      // Filtrar o cliente a ser removido
      const clientesAtualizados = clientes.filter(c => c.id !== id);
      
      // Salvar no localStorage específico da geradora
      localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify(clientesAtualizados));
      
      clienteRemovido = true;
    } else {
      // Procurar em todas as geradoras
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('clientes_')) {
          const clientesString = localStorage.getItem(key);
          if (clientesString) {
            const clientesArray = JSON.parse(clientesString);
            const clienteExiste = clientesArray.some((c: ClienteApp) => c.id === id);
            
            if (clienteExiste) {
              // Filtrar o cliente a ser removido
              const clientesAtualizados = clientesArray.filter((c: ClienteApp) => c.id !== id);
              
              // Salvar no localStorage específico da geradora
              localStorage.setItem(key, JSON.stringify(clientesAtualizados));
              
              geradoraDoCliente = key.replace('clientes_', '');
              clienteRemovido = true;
              break;
            }
          }
        }
      }
    }
    
    if (clienteRemovido && geradoraDoCliente) {
      // Remover do arquivo físico (se estiver no servidor)
      removeClienteFromFile(id, geradoraDoCliente);
      
      // Registrar no console
      console.log(`[Simulação] Cliente removido da geradora ${geradoraDoCliente}`);
      
      return true;
    } else {
      console.error(`Cliente com ID ${id} não encontrado em nenhuma geradora`);
      return false;
    }
  } catch (error) {
    console.error('Erro ao remover cliente do localStorage:', error);
    return false;
  }
}

/**
 * Salva um cliente em arquivo físico na estrutura de pastas
 * storage/geradora/[NOME_GERADORA]/clientes/[ID_CLIENTE]/dados.json
 */
function saveClienteToFile(cliente: ClienteApp): boolean {
  try {
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log('[Simulação] Salvando cliente em arquivo (simulado no navegador)');
      return true;
    }
    
    // Obter o nome da geradora
    const geradoraNome = getGeradoraNome(cliente.geradoraId);
    
    // Caminho do arquivo de dados do cliente
    const clienteDir = `storage/geradora/${geradoraNome}/clientes/${cliente.id}`;
    const clienteFilePath = `${clienteDir}/dados.json`;
    
    // Garantir que o diretório exista
    serverStorage.ensureDirectoryExists(clienteDir);
    
    // Salvar os dados do cliente
    const success = serverStorage.writeJsonFile(clienteFilePath, cliente);
    
    // Atualizar a lista de clientes da geradora
    updateClientesListFile(cliente.geradoraId, geradoraNome);
    
    return success;
  } catch (error) {
    console.error('Erro ao salvar cliente em arquivo:', error);
    return false;
  }
}

/**
 * Remove um cliente do arquivo físico
 */
function removeClienteFromFile(clienteId: string, geradoraId: string): boolean {
  try {
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log('[Simulação] Removendo cliente de arquivo (simulado no navegador)');
      return true;
    }
    
    // Obter o nome da geradora
    const geradoraNome = getGeradoraNome(geradoraId);
    
    // Caminho do diretório do cliente
    const clienteDir = `storage/geradora/${geradoraNome}/clientes/${clienteId}`;
    
    // Remover o diretório do cliente (recursivamente)
    if (serverStorage.fileExists(clienteDir)) {
      // Primeiro remover o arquivo de dados
      serverStorage.removeFile(`${clienteDir}/dados.json`);
      
      // Remover outros arquivos que possam existir
      const files = serverStorage.listFiles(clienteDir);
      files.forEach((file: string) => {
        serverStorage.removeFile(`${clienteDir}/${file}`);
      });
      
      // Remover o diretório (usando serverStorage)
      try {
        // Não podemos usar fs diretamente, então confiamos que o serverStorage
        // já removeu todos os arquivos dentro do diretório
        console.log(`Diretório de cliente esvaziado: ${clienteDir}`);
      } catch (error) {
        console.error(`Erro ao remover diretório ${clienteDir}:`, error);
      }
    }
    
    // Atualizar a lista de clientes da geradora
    updateClientesListFile(geradoraId, geradoraNome);
    
    return true;
  } catch (error) {
    console.error('Erro ao remover cliente de arquivo:', error);
    return false;
  }
}

/**
 * Atualiza o arquivo de lista de clientes da geradora
 */
function updateClientesListFile(geradoraId: string, geradoraNome: string): boolean {
  try {
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log('[Simulação] Atualizando lista de clientes em arquivo (simulado no navegador)');
      return true;
    }
    
    // Obter a lista de clientes da geradora do localStorage
    const clientes = getLocalClientes(geradoraId);
    
    // Caminho do arquivo de lista de clientes
    const clientesListFilePath = `storage/geradora/${geradoraNome}/clientes.json`;
    
    // Salvar a lista de clientes (apenas IDs e nomes para referência rápida)
    const clientesResumidos = clientes.map(c => ({
      id: c.id,
      nome: c.nome,
      email: c.email,
      cpfCnpj: c.cpfCnpj,
      status: c.status
    }));
    
    return serverStorage.writeJsonFile(clientesListFilePath, clientesResumidos);
  } catch (error) {
    console.error('Erro ao atualizar lista de clientes em arquivo:', error);
    return false;
  }
}

/**
 * Obtém o nome da geradora a partir do ID
 */
function getGeradoraNome(geradoraId: string): string {
  try {
    // Tentar obter do localStorage
    const geradorasString = localStorage.getItem('geradoras');
    if (geradorasString) {
      const geradoras = JSON.parse(geradorasString);
      const geradora = geradoras.find((g: { id: string; nome: string; responsavel?: string }) => g.id === geradoraId);
      if (geradora && geradora.nome) {
        // Usar apenas a primeira parte do nome ou o responsável para o nome da pasta
        const nomePasta = geradora.responsavel || geradora.nome.split(' ')[0];
        return nomePasta.toUpperCase();
      }
    }
    
    // Se não encontrou, usar o ID como nome
    return geradoraId;
  } catch (error) {
    console.error('Erro ao obter nome da geradora:', error);
    return geradoraId;
  }
}

/**
 * Inicializa o localStorage para clientes
 * Não inicializamos com dados de exemplo, apenas verificamos se o localStorage está disponível
 */
export function initLocalClientes(): void {
  // Apenas verificar se o localStorage está disponível
  try {
    // Contar o número total de clientes em todas as geradoras
    let totalClientes = 0;
    let totalGeradoras = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clientes_')) {
        totalGeradoras++;
        const clientesString = localStorage.getItem(key);
        if (clientesString) {
          const clientesArray = JSON.parse(clientesString);
          totalClientes += clientesArray.length;
        }
      }
    }
    
    console.log(`Inicialização do localStorage para clientes concluída. ${totalClientes} clientes encontrados em ${totalGeradoras} geradoras.`);
  } catch (error) {
    console.error('Erro ao inicializar localStorage para clientes:', error);
  }
}

/**
 * Sincroniza os clientes do localStorage para os arquivos
 */
export function syncClientesToFile(): void {
  try {
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log('[Simulação] Sincronizando clientes com arquivos (simulado no navegador)');
      return;
    }
    
    // Iterar sobre todas as geradoras no localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clientes_')) {
        const geradoraId = key.replace('clientes_', '');
        const geradoraNome = getGeradoraNome(geradoraId);
        
        // Obter clientes da geradora
        const clientes = getLocalClientes(geradoraId);
        
        // Criar diretório da geradora se não existir
        const geradoraDir = `storage/geradora/${geradoraNome}`;
        serverStorage.ensureDirectoryExists(geradoraDir);
        
        // Criar diretório de clientes se não existir
        const clientesDir = `${geradoraDir}/clientes`;
        serverStorage.ensureDirectoryExists(clientesDir);
        
        // Salvar cada cliente em seu próprio arquivo
        clientes.forEach(cliente => {
          const clienteDir = `${clientesDir}/${cliente.id}`;
          serverStorage.ensureDirectoryExists(clienteDir);
          
          // Salvar dados do cliente
          serverStorage.writeJsonFile(`${clienteDir}/dados.json`, cliente);
        });
        
        // Atualizar a lista de clientes da geradora
        updateClientesListFile(geradoraId, geradoraNome);
      }
    }
    
    console.log('[Sincronização] Clientes sincronizados com os arquivos.');
  } catch (error) {
    console.error('Erro ao sincronizar clientes com arquivos:', error);
  }
}

/**
 * Carrega os clientes dos arquivos para o localStorage
 */
export function loadClientesFromFile(): void {
  try {
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log('[Simulação] Carregando clientes dos arquivos (simulado no navegador)');
      return;
    }
    
    // Verificar se o diretório de geradoras existe
    const geradorasDir = 'storage/geradora';
    if (!serverStorage.fileExists(geradorasDir)) {
      console.log('Diretório de geradoras não encontrado.');
      return;
    }
    
    // Listar todas as geradoras
    const geradoras = serverStorage.listFiles(geradorasDir);
    
    // Iterar sobre cada geradora
    geradoras.forEach((geradoraNome: string) => {
      // Verificar se o diretório de clientes existe
      const clientesDir = `${geradorasDir}/${geradoraNome}/clientes`;
      if (!serverStorage.fileExists(clientesDir)) {
        return;
      }
      
      // Obter o ID da geradora
      const geradoraId = getGeradoraId(geradoraNome);
      if (!geradoraId) {
        console.error(`Não foi possível obter o ID da geradora ${geradoraNome}`);
        return;
      }
      
      // Listar todos os clientes
      const clientesDirs = serverStorage.listFiles(clientesDir);
      
      // Array para armazenar os clientes
      const clientes: ClienteApp[] = [];
      
      // Iterar sobre cada cliente
      clientesDirs.forEach((clienteDir: string) => {
        // Verificar se é um diretório (e não um arquivo)
        const clientePath = `${clientesDir}/${clienteDir}`;
        if (clienteDir !== 'clientes.json') {
          // Ler os dados do cliente
          const clienteData = serverStorage.readJsonFile<ClienteApp>(`${clientePath}/dados.json`);
          if (clienteData) {
            clientes.push(clienteData as ClienteApp);
          }
        }
      });
      
      // Salvar no localStorage
      localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify(clientes));
      
      console.log(`[Carregamento] ${clientes.length} clientes carregados para a geradora ${geradoraNome}`);
    });
    
    console.log('[Carregamento] Clientes carregados dos arquivos para o localStorage.');
  } catch (error) {
    console.error('Erro ao carregar clientes dos arquivos:', error);
  }
}

/**
 * Obtém o ID da geradora a partir do nome
 */
function getGeradoraId(geradoraNome: string): string | null {
  try {
    // Tentar obter do localStorage
    const geradorasString = localStorage.getItem('geradoras');
    if (geradorasString) {
      const geradoras = JSON.parse(geradorasString);
      
      // Procurar por correspondência no nome ou responsável
      const geradora = geradoras.find((g: { id: string; nome: string; responsavel?: string }) => {
        const nomePasta = (g.responsavel || g.nome.split(' ')[0]).toUpperCase();
        return nomePasta === geradoraNome;
      });
      
      if (geradora && geradora.id) {
        return geradora.id;
      }
    }
    
    // Se não encontrou, usar o nome como ID
    return geradoraNome.toLowerCase();
  } catch (error) {
    console.error('Erro ao obter ID da geradora:', error);
    return null;
  }
}

/**
 * Cria um arquivo de clientes para uma nova geradora
 * @param geradoraId ID da geradora
 * @param geradoraNome Nome da geradora
 */
export function createClientesFileForGeradora(geradoraId: string, geradoraNome: string): void {
  try {
    // Verificar se já existe um arquivo de clientes para esta geradora no localStorage
    const clientesString = localStorage.getItem(`clientes_${geradoraId}`);
    if (!clientesString) {
      // Criar um array vazio no localStorage
      localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify([]));
    }
    
    // Verificar se estamos no servidor
    if (!serverStorage) {
      console.log(`[Simulação] Arquivo de clientes criado para a geradora ${geradoraNome} (ID: ${geradoraId})`);
      return;
    }
    
    // Obter o nome da pasta da geradora
    const nomePasta = geradoraNome.split(' ')[0].toUpperCase();
    
    // Criar diretório da geradora se não existir
    const geradoraDir = `storage/geradora/${nomePasta}`;
    serverStorage.ensureDirectoryExists(geradoraDir);
    
    // Criar diretório de clientes se não existir
    const clientesDir = `${geradoraDir}/clientes`;
    serverStorage.ensureDirectoryExists(clientesDir);
    
    // Criar arquivo de lista de clientes vazio
    serverStorage.writeJsonFile(`${geradoraDir}/clientes.json`, []);
    
    console.log(`[Arquivo] Estrutura de diretórios criada para a geradora ${geradoraNome} (ID: ${geradoraId})`);
  } catch (error) {
    console.error(`Erro ao criar arquivo de clientes para a geradora ${geradoraNome}:`, error);
  }
}

// Verificar o localStorage ao importar o módulo
initLocalClientes();

// No navegador, não tentamos carregar do arquivo
console.log('[Inicialização] Usando localStorage para clientes.');

// Tentar sincronizar com os arquivos se estiver no servidor
if (typeof window === 'undefined') {
  console.log('[Inicialização] Tentando sincronizar clientes com arquivos...');
  syncClientesToFile();
}
