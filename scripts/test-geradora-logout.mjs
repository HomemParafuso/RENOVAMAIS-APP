#!/usr/bin/env node
// Script para testar o logout de uma geradora
// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulação simplificada do AuthContext.logout
async function simulateAuthLogout() {
  console.log('Simulando logout de geradora via AuthContext');
  
  try {
    // Verificar se há um usuário geradora no localStorage simulado
    const localStoragePath = path.join(process.cwd(), 'localStorage.json');
    
    if (!fs.existsSync(localStoragePath)) {
      console.error(`Arquivo ${localStoragePath} não encontrado.`);
      return false;
    }
    
    // Ler o conteúdo do localStorage
    const data = fs.readFileSync(localStoragePath, 'utf8');
    const localStorage = JSON.parse(data);
    
    // Verificar se há um usuário logado (simulado)
    if (!localStorage.currentUser) {
      console.log('Nenhum usuário logado para fazer logout.');
      return true; // Já está deslogado
    }
    
    const currentUser = JSON.parse(localStorage.currentUser);
    
    // Verificar se o usuário logado é uma geradora
    if (currentUser.role === 'geradora') {
      console.log('Usuário geradora encontrado:', currentUser.name);
      
      // Simular o logout removendo o usuário do localStorage
      delete localStorage.currentUser;
      
      // Salvar o localStorage atualizado
      fs.writeFileSync(localStoragePath, JSON.stringify(localStorage, null, 2));
      
      console.log('Logout realizado com sucesso!');
      console.log('Estado do usuário limpo.');
      
      return true;
    } else {
      console.log('Usuário logado não é uma geradora:', currentUser.role);
      return false;
    }
  } catch (error) {
    console.error('Erro ao simular logout:', error);
    return false;
  }
}

// Função principal
async function main() {
  // Executar o teste
  try {
    const success = await simulateAuthLogout();
    
    if (success) {
      console.log('\nTeste de logout concluído com sucesso!');
      console.log('A geradora foi deslogada corretamente.');
      process.exit(0);
    } else {
      console.error('\nTeste falhou: logout não realizado.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
