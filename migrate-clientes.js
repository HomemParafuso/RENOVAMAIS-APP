/**
 * Script para migrar clientes da estrutura antiga para a nova estrutura
 * 
 * Este script deve ser executado uma vez para migrar os dados existentes
 * da estrutura antiga (storage/clientes/clientes.json) para a nova estrutura:
 * storage/geradora/[NOME_GERADORA]/clientes/[ID_CLIENTE]/dados.json
 */

const fs = require('fs');
const path = require('path');
const serverStorage = require('./src/lib/server-storage');

// Função para simular o localStorage no Node.js
const localStorage = {
  _data: {},
  setItem: function(key, value) {
    this._data[key] = value;
  },
  getItem: function(key) {
    return this._data[key] !== undefined ? this._data[key] : null;
  },
  removeItem: function(key) {
    delete this._data[key];
  },
  clear: function() {
    this._data = {};
  },
  key: function(i) {
    const keys = Object.keys(this._data);
    return keys[i] || null;
  },
  get length() {
    return Object.keys(this._data).length;
  }
};

// Função para carregar dados da estrutura antiga
function carregarDadosAntigos() {
  try {
    console.log('Carregando dados da estrutura antiga...');
    
    // Verificar se o arquivo de clientes existe
    const clientesPath = path.join(__dirname, 'storage', 'clientes', 'clientes.json');
    if (!fs.existsSync(clientesPath)) {
      console.log('Arquivo de clientes não encontrado:', clientesPath);
      return [];
    }
    
    // Ler o arquivo de clientes
    const clientesString = fs.readFileSync(clientesPath, 'utf8');
    const clientes = JSON.parse(clientesString);
    
    console.log(`Carregados ${clientes.length} clientes da estrutura antiga.`);
    return clientes;
  } catch (error) {
    console.error('Erro ao carregar dados da estrutura antiga:', error);
    return [];
  }
}

// Função para carregar geradoras
function carregarGeradoras() {
  try {
    console.log('Carregando geradoras...');
    
    // Verificar se o arquivo de geradoras existe
    const geradorasPath = path.join(__dirname, 'storage', 'geradoras.json');
    if (fs.existsSync(geradorasPath)) {
      const geradorasString = fs.readFileSync(geradorasPath, 'utf8');
      const geradoras = JSON.parse(geradorasString);
      console.log(`Carregadas ${geradoras.length} geradoras do arquivo geradoras.json.`);
      return geradoras;
    }
    
    // Se não existir, tentar carregar do arquivo geradora.json
    const geradoraPath = path.join(__dirname, 'geradora.json');
    if (fs.existsSync(geradoraPath)) {
      const geradoraString = fs.readFileSync(geradoraPath, 'utf8');
      const geradora = JSON.parse(geradoraString);
      console.log('Carregada 1 geradora do arquivo geradora.json.');
      return [geradora];
    }
    
    // Se não encontrar nenhum arquivo, criar uma geradora padrão
    console.log('Nenhum arquivo de geradoras encontrado. Criando geradora padrão.');
    return [{
      id: 'geradora-1',
      nome: 'Geradora Padrão',
      email: 'geradora@exemplo.com',
      responsavel: 'GERADORA',
      status: 'ativo'
    }];
  } catch (error) {
    console.error('Erro ao carregar geradoras:', error);
    return [{
      id: 'geradora-1',
      nome: 'Geradora Padrão',
      email: 'geradora@exemplo.com',
      responsavel: 'GERADORA',
      status: 'ativo'
    }];
  }
}

// Função para migrar clientes para a nova estrutura
function migrarClientes(clientes, geradoras) {
  try {
    console.log('Migrando clientes para a nova estrutura...');
    
    // Salvar geradoras no localStorage simulado
    localStorage.setItem('geradoras', JSON.stringify(geradoras));
    
    // Agrupar clientes por geradora
    const clientesPorGeradora = {};
    
    // Se não houver geradoraId nos clientes, atribuir à primeira geradora
    const geradoraPadrao = geradoras[0];
    
    clientes.forEach(cliente => {
      // Garantir que o cliente tenha um geradoraId
      if (!cliente.geradoraId) {
        cliente.geradoraId = geradoraPadrao.id;
      }
      
      // Agrupar por geradoraId
      if (!clientesPorGeradora[cliente.geradoraId]) {
        clientesPorGeradora[cliente.geradoraId] = [];
      }
      
      clientesPorGeradora[cliente.geradoraId].push(cliente);
    });
    
    // Salvar clientes por geradora no localStorage simulado
    Object.keys(clientesPorGeradora).forEach(geradoraId => {
      localStorage.setItem(`clientes_${geradoraId}`, JSON.stringify(clientesPorGeradora[geradoraId]));
    });
    
    // Criar a estrutura de diretórios e salvar os arquivos
    Object.keys(clientesPorGeradora).forEach(geradoraId => {
      const clientesDaGeradora = clientesPorGeradora[geradoraId];
      
      // Encontrar a geradora correspondente
      const geradora = geradoras.find(g => g.id === geradoraId) || geradoraPadrao;
      
      // Obter o nome da pasta da geradora
      const nomePasta = (geradora.responsavel || geradora.nome.split(' ')[0]).toUpperCase();
      
      // Criar diretório da geradora
      const geradoraDir = path.join(__dirname, 'storage', 'geradora', nomePasta);
      serverStorage.ensureDirectoryExists(geradoraDir);
      
      // Criar diretório de clientes
      const clientesDir = path.join(geradoraDir, 'clientes');
      serverStorage.ensureDirectoryExists(clientesDir);
      
      // Salvar dados da geradora
      serverStorage.writeJsonFile(path.join(geradoraDir, 'dados.json'), geradora);
      
      // Salvar cada cliente em seu próprio diretório
      clientesDaGeradora.forEach(cliente => {
        // Garantir que o cliente tenha um ID
        if (!cliente.id) {
          cliente.id = `cliente_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        }
        
        // Criar diretório do cliente
        const clienteDir = path.join(clientesDir, cliente.id);
        serverStorage.ensureDirectoryExists(clienteDir);
        
        // Salvar dados do cliente
        serverStorage.writeJsonFile(path.join(clienteDir, 'dados.json'), cliente);
        console.log(`Cliente ${cliente.nome} (${cliente.id}) salvo em ${clienteDir}`);
      });
      
      // Salvar lista resumida de clientes
      const clientesResumidos = clientesDaGeradora.map(c => ({
        id: c.id,
        nome: c.nome,
        email: c.email,
        cpfCnpj: c.cpfCnpj || c.cpf || '',
        status: c.status || 'ativo'
      }));
      
      serverStorage.writeJsonFile(path.join(geradoraDir, 'clientes.json'), clientesResumidos);
      console.log(`Lista de ${clientesDaGeradora.length} clientes salva para a geradora ${nomePasta}`);
    });
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao migrar clientes:', error);
  }
}

// Função principal
function main() {
  console.log('Iniciando migração de clientes...');
  
  // Carregar dados da estrutura antiga
  const clientes = carregarDadosAntigos();
  
  // Se não houver clientes, não há o que migrar
  if (clientes.length === 0) {
    console.log('Nenhum cliente encontrado para migrar.');
    return;
  }
  
  // Carregar geradoras
  const geradoras = carregarGeradoras();
  
  // Migrar clientes para a nova estrutura
  migrarClientes(clientes, geradoras);
  
  console.log('Processo de migração concluído!');
}

// Executar a função principal
main();
