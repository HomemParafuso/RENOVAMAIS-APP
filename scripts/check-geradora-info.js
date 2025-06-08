#!/usr/bin/env node
// Script para verificar informações de uma geradora específica
// @ts-check
import fs from 'fs';
import path from 'path';

// Função para verificar informações de uma geradora
function checkGeradoraInfo(email) {
  console.log(`Verificando informações da geradora com email: ${email}`);
  
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
    console.log('Senha:', geradora.senha || 'Não definida');
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar informações da geradora:', error);
    return false;
  }
}

// Função principal
function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.error('Uso: node check-geradora-info.js <email>');
    process.exit(1);
  }

  // Executar a verificação
  try {
    const success = checkGeradoraInfo(email);
    
    if (success) {
      console.log('\nVerificação concluída com sucesso!');
      process.exit(0);
    } else {
      console.error('\nVerificação falhou: geradora não encontrada.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro na verificação:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
