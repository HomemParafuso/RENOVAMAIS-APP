/**
 * Script para iniciar o servidor com migração de dados
 * 
 * Este script executa a migração de dados e inicia o servidor
 * para o RENOVAMAIS-APP.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Função para executar um comando e retornar uma promessa
function executeCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.fg.cyan}Executando: ${colors.bright}${command} ${args.join(' ')}${colors.reset}`);
    
    const childProcess = spawn(command, args, {
      ...options,
      stdio: 'inherit',
      shell: true
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falhou com código de saída ${code}`));
      }
    });
    
    childProcess.on('error', (error) => {
      reject(error);
    });
  });
}

// Função para verificar se a migração já foi executada
function verificarMigracaoExecutada() {
  try {
    // Verificar se existe pelo menos um diretório na pasta storage/geradora
    const geradoraDir = path.join(__dirname, 'storage', 'geradora');
    
    if (!fs.existsSync(geradoraDir)) {
      return false;
    }
    
    const geradoras = fs.readdirSync(geradoraDir);
    return geradoras.length > 0;
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao verificar migração:${colors.reset}`, error);
    return false;
  }
}

// Função para executar a migração
async function executarMigracao() {
  try {
    // Verificar se a migração já foi executada
    if (verificarMigracaoExecutada()) {
      console.log(`${colors.fg.yellow}Migração já foi executada anteriormente. Pulando...${colors.reset}`);
      return;
    }
    
    console.log(`${colors.fg.green}${colors.bright}Iniciando migração de dados...${colors.reset}`);
    
    // Executar o script de migração
    await executeCommand('node', ['migrate-clientes.js']);
    
    console.log(`${colors.fg.green}${colors.bright}Migração concluída com sucesso!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro durante a migração:${colors.reset}`, error);
    console.log(`${colors.fg.yellow}Continuando com a inicialização do servidor...${colors.reset}`);
  }
}

// Função para iniciar o servidor
async function iniciarServidor() {
  try {
    console.log(`${colors.fg.green}${colors.bright}Iniciando servidor...${colors.reset}`);
    
    // Verificar se existe um script start-servers.js
    if (fs.existsSync(path.join(__dirname, 'start-servers.js'))) {
      await executeCommand('node', ['start-servers.js']);
    } else {
      // Caso contrário, iniciar com npm run dev
      await executeCommand('npm', ['run', 'dev']);
    }
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao iniciar servidor:${colors.reset}`, error);
    process.exit(1);
  }
}

// Função principal
async function main() {
  console.log(`${colors.fg.cyan}${colors.bright}=== RENOVAMAIS-APP - Inicialização com Migração ===${colors.reset}`);
  
  try {
    // Executar a migração
    await executarMigracao();
    
    // Iniciar o servidor
    await iniciarServidor();
  } catch (error) {
    console.error(`${colors.fg.red}Erro durante a inicialização:${colors.reset}`, error);
    process.exit(1);
  }
}

// Executar a função principal
main();
