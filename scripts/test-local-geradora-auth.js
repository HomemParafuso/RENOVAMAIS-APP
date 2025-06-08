#!/usr/bin/env node
// Script para testar o login de uma geradora usando o localStorage
// @ts-check
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Função para simular o login de uma geradora usando o localStorage
async function testLocalGeradoraLogin(email, password) {
  console.log(`Tentando fazer login com email: ${email}`);
  
  try {
    // Ler geradoras do localStorage (simulado lendo o arquivo)
    const geradoras = getLocalGeradoras();
    
    if (!geradoras || geradoras.length === 0) {
      console.error('Nenhuma geradora encontrada no localStorage');
      return null;
    }
    
    // Procurar geradora pelo email
    const geradora = geradoras.find(g => g.email === email);
    
    if (!geradora) {
      console.error(`Geradora com email ${email} não encontrada`);
      return null;
    }
    
    // Verificar senha (apenas para geradoras locais que têm senha armazenada)
    if (geradora.senha && geradora.senha !== password) {
      console.error('Senha incorreta');
      return null;
    }
    
    console.log('\nLogin bem-sucedido!');
    console.log('Dados da geradora:');
    console.log('ID:', geradora.id);
    console.log('Nome:', geradora.nome);
    console.log('Email:', geradora.email);
    console.log('Papel:', geradora.role);
    console.log('Status:', geradora.status);
    console.log('Aprovado:', geradora.isApproved);
    console.log('CNPJ:', geradora.cnpj);
    console.log('Responsável:', geradora.responsavel);
    console.log('Telefone:', geradora.telefone);
    
    return geradora;
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    return null;
  }
}

// Função para obter geradoras do localStorage (simulado)
function getLocalGeradoras() {
  try {
    // Verificar se o localStorage existe no navegador
    const localStorageData = localStorage.getItem('geradoras');
    if (localStorageData) {
      return JSON.parse(localStorageData);
    }
    
    // Fallback: ler do arquivo local
    const localStoragePath = path.join(process.cwd(), 'local-storage-mock.json');
    
    if (fs.existsSync(localStoragePath)) {
      const data = fs.readFileSync(localStoragePath, 'utf8');
      const parsedData = JSON.parse(data);
      return parsedData.geradoras || [];
    }
    
    console.log('Arquivo local-storage-mock.json não encontrado. Criando geradoras de exemplo...');
    
    // Criar geradoras de exemplo
    const geradoras = [
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
        status: 'ativo',
        senha: 'senha123' // Apenas para teste
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
        status: 'ativo',
        senha: 'senha456' // Apenas para teste
      }
    ];
    
    // Salvar no arquivo local
    fs.writeFileSync(
      localStoragePath, 
      JSON.stringify({ geradoras }, null, 2), 
      'utf8'
    );
    
    console.log('Geradoras de exemplo criadas e salvas em local-storage-mock.json');
    
    return geradoras;
  } catch (error) {
    console.error('Erro ao obter geradoras:', error);
    return [];
  }
}

// Simular localStorage para ambiente Node.js
const localStorage = {
  getItem: (key) => {
    try {
      const localStoragePath = path.join(process.cwd(), 'local-storage-mock.json');
      
      if (fs.existsSync(localStoragePath)) {
        const data = fs.readFileSync(localStoragePath, 'utf8');
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData[key] || null);
      }
      return null;
    } catch (error) {
      console.error('Erro ao ler localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      const localStoragePath = path.join(process.cwd(), 'local-storage-mock.json');
      let data = {};
      
      if (fs.existsSync(localStoragePath)) {
        const fileContent = fs.readFileSync(localStoragePath, 'utf8');
        data = JSON.parse(fileContent);
      }
      
      data[key] = JSON.parse(value);
      
      fs.writeFileSync(
        localStoragePath, 
        JSON.stringify(data, null, 2), 
        'utf8'
      );
    } catch (error) {
      console.error('Erro ao escrever no localStorage:', error);
    }
  }
};

// Função principal
async function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];

  if (!email || !password) {
    console.error('Uso: node test-local-geradora-auth.js <email> <senha>');
    process.exit(1);
  }

  // Executar o teste
  try {
    const geradora = await testLocalGeradoraLogin(email, password);
    
    if (geradora) {
      console.log('\nTeste concluído com sucesso');
      process.exit(0);
    } else {
      console.error('\nTeste falhou: login não realizado');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
