#!/usr/bin/env node
// Script para testar o login de uma geradora usando o GeradoraAuthContext
// @ts-check
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Simulação simplificada do GeradoraAuthContext.loginGeradora
async function simulateGeradoraLogin(email, password) {
  console.log(`Simulando login para geradora: ${email}`);
  
  try {
    // Verificar localStorage para login local
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
    
    // Procurar a geradora pelo email e senha
    const geradora = geradoras.find(g => 
      g.email === email && 
      (g.senha === password || !g.senha) // Verificar senha se existir
    );
    
    if (geradora) {
      console.log('Login local bem-sucedido para geradora:', geradora.nome);
      
      // Criar objeto de geradora a partir dos dados locais
      const geradoraUser = {
        id: geradora.id,
        email: geradora.email,
        nome: geradora.nome,
        role: 'geradora',
        isApproved: geradora.isApproved || true,
        createdAt: new Date(geradora.dataCadastro || geradora.createdAt || new Date()),
        updatedAt: new Date(),
        cnpj: geradora.cnpj,
        responsavel: geradora.responsavel,
        telefone: geradora.telefone,
        endereco: geradora.endereco,
        status: geradora.status || 'ativo'
      };
      
      console.log('\nObjeto de geradora criado:');
      console.log(JSON.stringify(geradoraUser, null, 2));
      
      // Atualizar o localStorage com a geradora logada
      localStorage.geradora_logada = JSON.stringify(geradora);
      fs.writeFileSync(localStoragePath, JSON.stringify(localStorage, null, 2));
      console.log('Geradora definida como logada no localStorage.');
      
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

  if (!email || !password) {
    console.error('Uso: node test-geradora-auth-context.js <email> <senha>');
    process.exit(1);
  }

  // Executar o teste
  try {
    const success = await simulateGeradoraLogin(email, password);
    
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
main();
