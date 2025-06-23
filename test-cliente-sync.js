/**
 * Script para sincronizar clientes do localStorage para a estrutura de arquivos
 * 
 * Este script deve ser executado no servidor para migrar os dados existentes
 * para a nova estrutura de pastas:
 * 
 * storage/geradora/[NOME_GERADORA]/clientes/[ID_CLIENTE]/dados.json
 */

// Importar módulos necessários
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

// Função para carregar dados do arquivo para o localStorage simulado
function carregarDadosParaLocalStorage() {
  try {
    console.log('Carregando dados dos arquivos para o localStorage simulado...');
    
    // Carregar geradoras
    const geradorasPath = path.join(__dirname, 'storage', 'geradora');
    if (fs.existsSync(geradorasPath)) {
      const geradoras = fs.readdirSync(geradorasPath);
      
      // Array para armazenar todas as geradoras
      const geradorasData = [];
      
      // Iterar sobre cada pasta de geradora
      geradoras.forEach(geradoraNome => {
        const geradoraPath = path.join(geradorasPath, geradoraNome);
        const dadosPath = path.join(geradoraPath, 'dados.json');
        
        // Verificar se existe o arquivo dados.json
        if (fs.existsSync(dadosPath)) {
          try {
            const dadosGeradora = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
            geradorasData.push(dadosGeradora);
            
            // Carregar clientes da geradora
            const clientesPath = path.join(geradoraPath, 'clientes');
            if (fs.existsSync(clientesPath)) {
              const clientesDirs = fs.readdirSync(clientesPath).filter(item => {
                return fs.statSync(path.join(clientesPath, item)).isDirectory();
              });
              
              // Array para armazenar os clientes da geradora
              const clientesData = [];
              
              // Iterar sobre cada pasta de cliente
              clientesDirs.forEach(clienteDir => {
                const clienteDadosPath = path.join(clientesPath, clienteDir, 'dados.json');
                if (fs.existsSync(clienteDadosPath)) {
                  try {
                    const dadosCliente = JSON.parse(fs.readFileSync(clienteDadosPath, 'utf8'));
                    clientesData.push(dadosCliente);
                  } catch (error) {
                    console.error(`Erro ao ler dados do cliente ${clienteDir}:`, error);
                  }
                }
              });
              
              // Salvar clientes no localStorage simulado
              if (clientesData.length > 0 && dadosGeradora.id) {
                localStorage.setItem(`clientes_${dadosGeradora.id}`, JSON.stringify(clientesData));
                console.log(`Carregados ${clientesData.length} clientes para a geradora ${geradoraNome}`);
              }
            }
          } catch (error) {
            console.error(`Erro ao ler dados da geradora ${geradoraNome}:`, error);
          }
        }
      });
      
      // Salvar geradoras no localStorage simulado
      if (geradorasData.length > 0) {
        localStorage.setItem('geradoras', JSON.stringify(geradorasData));
        console.log(`Carregadas ${geradorasData.length} geradoras`);
      }
    }
    
    console.log('Dados carregados com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Função para obter o nome da geradora a partir do ID
function getGeradoraNome(geradoraId) {
  try {
    // Tentar obter do localStorage
    const geradorasString = localStorage.getItem('geradoras');
    if (geradorasString) {
      const geradoras = JSON.parse(geradorasString);
      const geradora = geradoras.find(g => g.id === geradoraId);
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

// Função para sincronizar clientes do localStorage para os arquivos
function sincronizarClientesParaArquivos() {
  try {
    console.log('Sincronizando clientes do localStorage para os arquivos...');
    
    // Iterar sobre todas as geradoras no localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clientes_')) {
        const geradoraId = key.replace('clientes_', '');
        const geradoraNome = getGeradoraNome(geradoraId);
        
        // Obter clientes da geradora
        const clientesString = localStorage.getItem(key);
        if (clientesString) {
          const clientes = JSON.parse(clientesString);
          
          // Criar diretório da geradora se não existir
          const geradoraDir = path.join(__dirname, 'storage', 'geradora', geradoraNome);
          serverStorage.ensureDirectoryExists(geradoraDir);
          
          // Criar diretório de clientes se não existir
          const clientesDir = path.join(geradoraDir, 'clientes');
          serverStorage.ensureDirectoryExists(clientesDir);
          
          // Salvar cada cliente em seu próprio arquivo
          clientes.forEach(cliente => {
            const clienteDir = path.join(clientesDir, cliente.id);
            serverStorage.ensureDirectoryExists(clienteDir);
            
            // Salvar dados do cliente
            serverStorage.writeJsonFile(path.join(clienteDir, 'dados.json'), cliente);
            console.log(`Cliente ${cliente.nome} (${cliente.id}) salvo em ${clienteDir}`);
          });
          
          // Salvar lista de clientes resumida
          const clientesResumidos = clientes.map(c => ({
            id: c.id,
            nome: c.nome,
            email: c.email,
            cpfCnpj: c.cpfCnpj,
            status: c.status
          }));
          
          serverStorage.writeJsonFile(path.join(geradoraDir, 'clientes.json'), clientesResumidos);
          console.log(`Lista de ${clientes.length} clientes salva para a geradora ${geradoraNome}`);
        }
      }
    }
    
    console.log('Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar clientes:', error);
  }
}

// Função principal
function main() {
  console.log('Iniciando sincronização de clientes...');
  
  // Carregar dados existentes para o localStorage simulado
  carregarDadosParaLocalStorage();
  
  // Sincronizar clientes do localStorage para os arquivos
  sincronizarClientesParaArquivos();
  
  console.log('Processo concluído!');
}

// Executar a função principal
main();
