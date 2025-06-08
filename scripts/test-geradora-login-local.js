#!/usr/bin/env node
// Script para testar o login local de uma geradora específica
// @ts-check
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Função para testar o login local de uma geradora
async function testGeradoraLoginLocal(email, password) {
  console.log(`Testando login local para geradora: ${email}`);
  
  try {
    // Verificar se o arquivo localStorage existe
    const localStoragePath = path.join(process.cwd(), 'local-storage-mock.json');
    
    if (!fs.existsSync(localStoragePath)) {
      console.error(`Arquivo ${localStoragePath} não encontrado.`);
      return false;
    }
    
    // Ler o conteúdo do localStorage
    const data = fs.readFileSync(localStoragePath, 'utf8');
    const localStorage = JSON.parse(data);
    
    // Verificar se há geradoras no localStorage
    if (!localStorage.geradoras || !Array.isArray(localStorage.geradoras)) {
      console.error('Nenhuma geradora encontrada no localStorage.');
      return false;
    }
    
    // Procurar a geradora pelo email
    const geradora = localStorage.geradoras.find(g => g.email === email);
    
    if (!geradora) {
      console.error(`Geradora com email ${email} não encontrada no localStorage.`);
      return false;
    }
    
    console.log('\nGeradora encontrada no localStorage:');
    console.log('ID:', geradora.id);
    console.log('Nome:', geradora.nome);
    console.log('Email:', geradora.email);
    console.log('Papel:', geradora.role || 'geradora');
    console.log('Status:', geradora.status || 'ativo');
    console.log('CNPJ:', geradora.cnpj);
    console.log('Responsável:', geradora.responsavel);
    console.log('Telefone:', geradora.telefone);
    
    // Verificar a senha (se existir)
    if (geradora.senha) {
      if (geradora.senha === password) {
        console.log('\nSenha correta! Login local bem-sucedido.');
        return true;
      } else {
        console.error('\nSenha incorreta! Login local falhou.');
        return false;
      }
    } else {
      console.log('\nGeradora não tem senha definida no localStorage. Qualquer senha seria aceita.');
      return true;
    }
  } catch (error) {
    console.error('Erro ao testar login local:', error);
    return false;
  }
}

// Função para simular o login como implementado no GeradoraAuthContext
async function simulateContextLogin(email, password) {
  console.log(`\nSimulando login como implementado no GeradoraAuthContext para: ${email}`);
  
  try {
    // Ler o conteúdo do localStorage
    const localStoragePath = path.join(process.cwd(), 'local-storage-mock.json');
    const data = fs.readFileSync(localStoragePath, 'utf8');
    const localStorage = JSON.parse(data);
    
    // Verificar se há geradoras no localStorage
    if (!localStorage.geradoras || !Array.isArray(localStorage.geradoras)) {
      console.error('Nenhuma geradora encontrada no localStorage.');
      return false;
    }
    
    // Procurar a geradora pelo email e senha
    const geradora = localStorage.geradoras.find(g => 
      g.email === email && 
      (g.senha === password || !g.senha) // Verificar senha se existir
    );
    
    if (geradora) {
      console.log('Login local bem-sucedido para geradora:', geradora.nome);
      
      // Criar objeto de geradora a partir dos dados locais (simulando o que o context faria)
      const geradoraUser = {
        id: geradora.id,
        email: geradora.email,
        nome: geradora.nome,
        role: 'geradora',
        isApproved: geradora.isApproved || true,
        createdAt: new Date(geradora.dataCadastro || new Date()),
        updatedAt: new Date(),
        cnpj: geradora.cnpj,
        responsavel: geradora.responsavel,
        telefone: geradora.telefone,
        endereco: geradora.endereco,
        status: geradora.status || 'ativo'
      };
      
      console.log('\nObjeto de geradora criado:');
      console.log(JSON.stringify(geradoraUser, null, 2));
      
      return true;
    } else {
      console.error('Geradora não encontrada ou senha incorreta.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao simular login:', error);
    return false;
  }
}

// Função principal
async function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];
  const simulateContext = args[2] === '--simulate-context';

  if (!email || !password) {
    console.error('Uso: node test-geradora-login-local.js <email> <senha> [--simulate-context]');
    process.exit(1);
  }

  // Executar o teste
  try {
    let success;
    
    if (simulateContext) {
      success = await simulateContextLogin(email, password);
    } else {
      success = await testGeradoraLoginLocal(email, password);
    }
    
    if (success) {
      console.log('\nTeste concluído com sucesso!');
      process.exit(0);
    } else {
      console.error('\nTeste falhou: login não realizado.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
}

// Executar a função principal
