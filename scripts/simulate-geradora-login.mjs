#!/usr/bin/env node
// Script para simular o login de uma geradora no localStorage
// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulação de login de geradora no localStorage
async function simulateGeradoraLogin(email) {
  console.log(`Simulando login para geradora: ${email}`);
  
  try {
    // Verificar localStorage para encontrar a geradora
    const localStoragePath = path.join(process.cwd(), 'localStorage.json');
    
    if (!fs.existsSync(localStoragePath)) {
      console.error(`Arquivo ${localStoragePath} não encontrado.`);
      return false;
    }
    
    // Ler o conteúdo do localStorage
    const data = fs.readFileSync(localStoragePath, 'utf8');
    const localStorage = JSON.parse(data);
    
    // Verificar se há geradoras no localStorage
    if (!localStorage.geradoras) {
      console.error('Nenhuma geradora encontrada no localStorage.');
      return false;
    }
    
    // Converter a string JSON para array
    const geradoras = JSON.parse(localStorage.geradoras);
    
    // Procurar a geradora pelo email
    const geradora = geradoras.find(g => g.email === email);
    
    if (geradora) {
      console.log('Geradora encontrada:', geradora.nome);
      
      // Criar objeto de usuário a partir dos dados da geradora
      const geradoraUser = {
        id: geradora.id,
        email: geradora.email,
        name: geradora.nome,
        role: 'geradora',
        isApproved: geradora.isApproved || true,
        createdAt: new Date(geradora.dataCadastro || geradora.createdAt || new Date()).toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('\nObjeto de usuário geradora criado:');
      console.log(JSON.stringify(geradoraUser, null, 2));
      
      // Simular o login salvando o usuário no localStorage
      localStorage.currentUser = JSON.stringify(geradoraUser);
      
      // Salvar o localStorage atualizado
      fs.writeFileSync(localStoragePath, JSON.stringify(localStorage, null, 2));
      
      console.log('\nLogin simulado com sucesso!');
      console.log('Usuário geradora salvo no localStorage.');
      
      return true;
    } else {
      console.error(`Geradora com email ${email} não encontrada.`);
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

  if (!email) {
    console.error('Uso: node simulate-geradora-login.mjs <email>');
    process.exit(1);
  }

  // Executar o teste
  try {
    const success = await simulateGeradoraLogin(email);
    
    if (success) {
      console.log('\nSimulação concluída com sucesso!');
      console.log('A geradora foi logada no localStorage.');
      process.exit(0);
    } else {
      console.error('\nSimulação falhou: login não realizado.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro na simulação:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
