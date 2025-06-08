// Script para testar o login local da geradora
// Execute este script com Node.js

import * as fs from 'fs';
import * as path from 'path';

// Função para simular o localStorage
class LocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Criar uma instância do localStorage simulado
global.localStorage = new LocalStorage();

// Função para carregar dados do localStorage real (do navegador)
function loadLocalStorageFromFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const localStorage = JSON.parse(data);
      
      // Carregar os dados no localStorage simulado
      for (const key in localStorage) {
        global.localStorage.setItem(key, localStorage[key]);
      }
      
      console.log(`Dados do localStorage carregados de ${filePath}`);
      return true;
    } else {
      console.log(`Arquivo ${filePath} não encontrado.`);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao carregar dados do localStorage: ${error.message}`);
    return false;
  }
}

// Função para salvar dados do localStorage simulado em um arquivo
function saveLocalStorageToFile(filePath) {
  try {
    const data = JSON.stringify(global.localStorage.store, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Dados do localStorage salvos em ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao salvar dados do localStorage: ${error.message}`);
    return false;
  }
}

// Função para inicializar geradoras de exemplo no localStorage
function initLocalGeradoras() {
  // Verificar se já existem geradoras no localStorage
  const geradorasSalvas = global.localStorage.getItem('geradoras');
  
  if (geradorasSalvas) {
    console.log('Geradoras já inicializadas no localStorage');
    return JSON.parse(geradorasSalvas);
  }
  
  // Criar geradoras de exemplo
  const geradoras = [
    {
      id: 'geradora-1',
      email: 'geradora1@exemplo.com',
      nome: 'Geradora Solar Ltda',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cnpj: '12.345.678/0001-90',
      responsavel: 'João Silva',
      telefone: '(11) 98765-4321',
      endereco: 'Av. Paulista, 1000, São Paulo - SP',
      status: 'ativo',
      senha: '!Binho102030'
    },
    {
      id: 'geradora-2',
      email: 'geradora2@exemplo.com',
      nome: 'Energia Renovável S.A.',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cnpj: '98.765.432/0001-10',
      responsavel: 'Maria Oliveira',
      telefone: '(21) 98765-4321',
      endereco: 'Rua da Energia, 500, Rio de Janeiro - RJ',
      status: 'ativo',
      senha: '!Binho102030'
    },
    {
      id: 'geradora-3',
      email: 'geradora3@exemplo.com',
      nome: 'Eco Energia Ltda',
      role: 'geradora',
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cnpj: '45.678.901/0001-23',
      responsavel: 'Carlos Santos',
      telefone: '(31) 98765-4321',
      endereco: 'Av. do Sol, 200, Belo Horizonte - MG',
      status: 'ativo',
      senha: '!Binho102030'
    }
  ];
  
  // Adicionar a geradora do Firebase
  geradoras.push({
    id: '3CW0KdVx9pvRmDmiYzBZ',
    email: 'ptacyanno@gmail.com',
    nome: 'Geradora Laiany',
    role: 'geradora',
    isApproved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cnpj: '45571678000162',
    responsavel: 'LAIANY',
    telefone: '84996010658',
    status: 'ativo',
    senha: '!Binho102030'
  });
  
  // Salvar geradoras no localStorage
  global.localStorage.setItem('geradoras', JSON.stringify(geradoras));
  
  console.log('Geradoras inicializadas no localStorage:', geradoras);
  return geradoras;
}

// Função para testar o login da geradora
function testGeradoraLogin(email, senha) {
  try {
    console.log(`\nTestando login da geradora com email: ${email}`);
    
    // Buscar geradoras do localStorage
    const geradorasSalvas = global.localStorage.getItem('geradoras');
    
    if (!geradorasSalvas) {
      throw new Error('Nenhuma geradora encontrada');
    }
    
    const geradoras = JSON.parse(geradorasSalvas);
    
    // Encontrar a geradora pelo email
    const geradoraEncontrada = geradoras.find((g) => g.email === email);
    
    if (!geradoraEncontrada) {
      throw new Error('Geradora não encontrada');
    }
    
    // Verificar a senha
    if (!geradoraEncontrada.senha) {
      throw new Error('Geradora sem senha definida. Entre em contato com o administrador.');
    }
    
    console.log('Tentando login com senha:', senha);
    
    if (senha !== geradoraEncontrada.senha) {
      throw new Error('Senha incorreta');
    }
    
    // Verificar se a geradora está aprovada
    if (geradoraEncontrada.status === 'bloqueado') {
      throw new Error('Geradora bloqueada');
    }
    
    // Salvar a geradora no localStorage como logada
    global.localStorage.setItem('geradora_logada', JSON.stringify(geradoraEncontrada));
    
    console.log('Login bem-sucedido!');
    console.log('Geradora:', geradoraEncontrada.nome);
    
    return {
      success: true,
      message: 'Login bem-sucedido',
      geradora: geradoraEncontrada
    };
  } catch (error) {
    console.error('Erro ao fazer login da geradora:', error.message);
    
    return {
      success: false,
      message: `Erro: ${error.message}`,
      error: error
    };
  }
}

// Função principal
async function main() {
  try {
    console.log('Iniciando teste de login local da geradora...');
    
    // Caminho para o arquivo de localStorage (opcional)
    const localStoragePath = path.join(process.cwd(), 'localStorage.json');
    
    // Tentar carregar dados do localStorage de um arquivo (opcional)
    loadLocalStorageFromFile(localStoragePath);
    
    // Inicializar geradoras de exemplo
    const geradoras = initLocalGeradoras();
    
    console.log('\nGeradoras disponíveis para teste:');
    geradoras.forEach((geradora, index) => {
      console.log(`${index + 1}. ${geradora.nome} (${geradora.email})`);
    });
    
    // Testar login da geradora do Firebase
    const geradoraFirebase = geradoras.find(g => g.id === '3CW0KdVx9pvRmDmiYzBZ');
    
    if (geradoraFirebase) {
      console.log('\nTestando login da geradora do Firebase:');
      const loginResult = testGeradoraLogin(geradoraFirebase.email, geradoraFirebase.senha);
      
      if (loginResult.success) {
        console.log('\nInstruções para acessar o portal da geradora:');
        console.log('1. Acesse http://192.168.1.133:8080/geradora-login no navegador');
        console.log(`2. Use o email: ${geradoraFirebase.email}`);
        console.log(`3. Use a senha: ${geradoraFirebase.senha}`);
        console.log('4. Clique em "Entrar"');
        console.log('5. Você será redirecionado para o portal da geradora');
      } else {
        console.log('\nNão foi possível fazer login como geradora. Verifique as credenciais.');
      }
    } else {
      console.log('\nGeradora do Firebase não encontrada.');
    }
    
    // Testar login de uma geradora de exemplo
    const geradoraExemplo = geradoras[0];
    
    console.log('\nTestando login da geradora de exemplo:');
    const loginResult = testGeradoraLogin(geradoraExemplo.email, geradoraExemplo.senha);
    
    if (loginResult.success) {
      console.log('\nInstruções para acessar o portal da geradora de exemplo:');
      console.log('1. Acesse http://192.168.1.133:8080/geradora-login no navegador');
      console.log(`2. Use o email: ${geradoraExemplo.email}`);
      console.log(`3. Use a senha: ${geradoraExemplo.senha}`);
      console.log('4. Clique em "Entrar"');
      console.log('5. Você será redirecionado para o portal da geradora');
    } else {
      console.log('\nNão foi possível fazer login como geradora de exemplo. Verifique as credenciais.');
    }
    
    // Salvar dados do localStorage em um arquivo (opcional)
    saveLocalStorageToFile(localStoragePath);
    
    console.log('\nTeste de login local concluído!');
    console.log('\nImportante: Para que o login local funcione no navegador, você precisa:');
    console.log('1. Abrir o console do navegador (F12)');
    console.log('2. Executar o seguinte comando para inicializar as geradoras:');
    console.log(`
// Inicializar geradoras no localStorage
const geradoras = ${JSON.stringify(geradoras, null, 2)};
localStorage.setItem('geradoras', JSON.stringify(geradoras));
console.log('Geradoras inicializadas no localStorage');
    `);
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
  }
}

// Executar a função principal
main();
