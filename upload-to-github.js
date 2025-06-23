/**
 * Script para carregar atualizações para o GitHub
 * 
 * Este script verifica se o Git está configurado e envia as alterações
 * para o repositório GitHub do RENOVAMAIS-APP.
 */

const { spawn, exec } = require('child_process');
const readline = require('readline');

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

// Criar interface de leitura para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para executar um comando e retornar a saída
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Função para executar um comando interativo
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

// Função para perguntar ao usuário
function perguntarUsuario(pergunta) {
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => {
      resolve(resposta);
    });
  });
}

// Função para verificar se o Git está instalado
async function verificarGit() {
  try {
    const versao = await execCommand('git --version');
    console.log(`${colors.fg.green}Git encontrado: ${colors.bright}${versao}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.fg.red}${colors.bright}Git não encontrado. Por favor, instale o Git para continuar.${colors.reset}`);
    return false;
  }
}

// Função para verificar se o diretório atual é um repositório Git
async function verificarRepositorioGit() {
  try {
    await execCommand('git rev-parse --is-inside-work-tree');
    return true;
  } catch (error) {
    return false;
  }
}

// Função para inicializar o repositório Git
async function inicializarRepositorio() {
  try {
    await executeCommand('git', ['init']);
    console.log(`${colors.fg.green}Repositório Git inicializado com sucesso.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao inicializar repositório Git:${colors.reset}`, error);
    throw error;
  }
}

// Função para verificar se o remote já está configurado
async function verificarRemote() {
  try {
    const remotes = await execCommand('git remote -v');
    return remotes.includes('github.com/HomemParafuso/RENOVAMAIS-APP');
  } catch (error) {
    return false;
  }
}

// Função para adicionar o remote
async function adicionarRemote() {
  try {
    await executeCommand('git', ['remote', 'add', 'origin', 'https://github.com/HomemParafuso/RENOVAMAIS-APP.git']);
    console.log(`${colors.fg.green}Remote 'origin' adicionado com sucesso.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao adicionar remote:${colors.reset}`, error);
    
    // Verificar se o erro é porque o remote já existe
    if (error.message.includes('remote origin already exists')) {
      await executeCommand('git', ['remote', 'set-url', 'origin', 'https://github.com/HomemParafuso/RENOVAMAIS-APP.git']);
      console.log(`${colors.fg.green}Remote 'origin' atualizado com sucesso.${colors.reset}`);
    } else {
      throw error;
    }
  }
}

// Função para verificar o status do Git
async function verificarStatus() {
  try {
    const status = await execCommand('git status --porcelain');
    return status.trim() !== '';
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao verificar status do Git:${colors.reset}`, error);
    throw error;
  }
}

// Função para adicionar arquivos ao Git
async function adicionarArquivos() {
  try {
    // Perguntar se deseja adicionar todos os arquivos ou arquivos específicos
    const resposta = await perguntarUsuario(`${colors.fg.yellow}Deseja adicionar todos os arquivos? (S/n): ${colors.reset}`);
    
    if (resposta.toLowerCase() !== 'n') {
      // Adicionar todos os arquivos
      await executeCommand('git', ['add', '.']);
      console.log(`${colors.fg.green}Todos os arquivos foram adicionados.${colors.reset}`);
    } else {
      // Listar arquivos modificados
      const status = await execCommand('git status --porcelain');
      console.log(`${colors.fg.cyan}Arquivos modificados:${colors.reset}`);
      console.log(status);
      
      // Perguntar quais arquivos adicionar
      const arquivos = await perguntarUsuario(`${colors.fg.yellow}Digite os arquivos a adicionar (separados por espaço): ${colors.reset}`);
      
      if (arquivos.trim() !== '') {
        await executeCommand('git', ['add', ...arquivos.split(' ')]);
        console.log(`${colors.fg.green}Arquivos selecionados foram adicionados.${colors.reset}`);
      } else {
        console.log(`${colors.fg.yellow}Nenhum arquivo adicionado.${colors.reset}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao adicionar arquivos:${colors.reset}`, error);
    throw error;
  }
}

// Função para fazer commit
async function fazerCommit() {
  try {
    // Perguntar a mensagem de commit
    const mensagem = await perguntarUsuario(`${colors.fg.yellow}Digite a mensagem de commit: ${colors.reset}`);
    
    if (mensagem.trim() === '') {
      console.log(`${colors.fg.yellow}Mensagem de commit vazia. Usando mensagem padrão.${colors.reset}`);
      await executeCommand('git', ['commit', '-m', 'Atualização do sistema de armazenamento RENOVAMAIS-APP']);
    } else {
      await executeCommand('git', ['commit', '-m', mensagem]);
    }
    
    console.log(`${colors.fg.green}Commit realizado com sucesso.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao fazer commit:${colors.reset}`, error);
    
    // Verificar se o erro é porque não há nada para commit
    if (error.message.includes('nothing to commit')) {
      console.log(`${colors.fg.yellow}Não há alterações para commit.${colors.reset}`);
      return false;
    }
    
    // Verificar se o erro é porque o usuário não está configurado
    if (error.message.includes('Please tell me who you are')) {
      console.log(`${colors.fg.yellow}Configuração de usuário Git necessária.${colors.reset}`);
      
      const nome = await perguntarUsuario(`${colors.fg.yellow}Digite seu nome para configuração do Git: ${colors.reset}`);
      const email = await perguntarUsuario(`${colors.fg.yellow}Digite seu email para configuração do Git: ${colors.reset}`);
      
      if (nome.trim() !== '' && email.trim() !== '') {
        await executeCommand('git', ['config', '--local', 'user.name', nome]);
        await executeCommand('git', ['config', '--local', 'user.email', email]);
        
        // Tentar fazer o commit novamente
        return await fazerCommit();
      } else {
        console.log(`${colors.fg.red}Nome ou email inválidos. Não foi possível configurar o Git.${colors.reset}`);
        return false;
      }
    }
    
    throw error;
  }
}

// Função para enviar para o GitHub
async function enviarParaGitHub() {
  try {
    // Verificar se há um branch atual
    let branch;
    try {
      branch = await execCommand('git rev-parse --abbrev-ref HEAD');
    } catch (error) {
      // Se não houver branch, criar um branch main
      await executeCommand('git', ['checkout', '-b', 'main']);
      branch = 'main';
    }
    
    // Perguntar se deseja usar autenticação por token
    const usarToken = await perguntarUsuario(`${colors.fg.yellow}Deseja usar token de autenticação? (S/n): ${colors.reset}`);
    
    if (usarToken.toLowerCase() !== 'n') {
      const token = await perguntarUsuario(`${colors.fg.yellow}Digite seu token de acesso pessoal do GitHub: ${colors.reset}`);
      
      if (token.trim() !== '') {
        // Usar token para autenticação
        const repoUrl = `https://${token}@github.com/HomemParafuso/RENOVAMAIS-APP.git`;
        await executeCommand('git', ['remote', 'set-url', 'origin', repoUrl]);
      }
    }
    
    // Enviar para o GitHub
    await executeCommand('git', ['push', '-u', 'origin', branch]);
    
    console.log(`${colors.fg.green}${colors.bright}Alterações enviadas com sucesso para o GitHub!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao enviar para o GitHub:${colors.reset}`, error);
    
    // Verificar se o erro é de autenticação
    if (error.message.includes('Authentication failed') || error.message.includes('could not read Username')) {
      console.log(`${colors.fg.yellow}Falha na autenticação. Tente novamente com um token válido.${colors.reset}`);
      
      const tentarNovamente = await perguntarUsuario(`${colors.fg.yellow}Deseja tentar novamente? (S/n): ${colors.reset}`);
      
      if (tentarNovamente.toLowerCase() !== 'n') {
        return await enviarParaGitHub();
      }
    }
    
    return false;
  }
}

// Função principal
async function main() {
  console.log(`${colors.fg.cyan}${colors.bright}=== Upload para GitHub - RENOVAMAIS-APP ===${colors.reset}`);
  
  try {
    // Verificar se o Git está instalado
    const gitInstalado = await verificarGit();
    if (!gitInstalado) {
      return;
    }
    
    // Verificar se o diretório atual é um repositório Git
    const ehRepositorio = await verificarRepositorioGit();
    if (!ehRepositorio) {
      console.log(`${colors.fg.yellow}Este diretório não é um repositório Git. Inicializando...${colors.reset}`);
      await inicializarRepositorio();
    }
    
    // Verificar se o remote está configurado
    const remoteConfigurado = await verificarRemote();
    if (!remoteConfigurado) {
      console.log(`${colors.fg.yellow}Remote 'origin' não configurado. Adicionando...${colors.reset}`);
      await adicionarRemote();
    }
    
    // Verificar se há alterações para commit
    const temAlteracoes = await verificarStatus();
    if (!temAlteracoes) {
      console.log(`${colors.fg.yellow}Não há alterações para commit.${colors.reset}`);
      
      // Perguntar se deseja enviar mesmo assim
      const enviarMesmoAssim = await perguntarUsuario(`${colors.fg.yellow}Deseja enviar para o GitHub mesmo assim? (s/N): ${colors.reset}`);
      
      if (enviarMesmoAssim.toLowerCase() !== 's') {
        console.log(`${colors.fg.cyan}Operação cancelada pelo usuário.${colors.reset}`);
        rl.close();
        return;
      }
    } else {
      // Adicionar arquivos
      const arquivosAdicionados = await adicionarArquivos();
      if (!arquivosAdicionados) {
        console.log(`${colors.fg.cyan}Operação cancelada pelo usuário.${colors.reset}`);
        rl.close();
        return;
      }
      
      // Fazer commit
      const commitRealizado = await fazerCommit();
      if (!commitRealizado) {
        console.log(`${colors.fg.cyan}Não foi possível realizar o commit.${colors.reset}`);
        rl.close();
        return;
      }
    }
    
    // Enviar para o GitHub
    await enviarParaGitHub();
    
    console.log(`${colors.fg.green}${colors.bright}Processo concluído com sucesso!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro durante o processo:${colors.reset}`, error);
  } finally {
    rl.close();
  }
}

// Executar a função principal
main();
