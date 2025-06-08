#!/usr/bin/env node
// Script para adicionar uma geradora ao localStorage
// @ts-check
import fs from 'fs';
import path from 'path';

// Função para adicionar uma geradora ao localStorage
function addGeradoraToLocalStorage(email, password, nome, cnpj, responsavel, telefone) {
  console.log(`Adicionando geradora ${nome} (${email}) ao localStorage...`);
  
  try {
    // Verificar se o arquivo localStorage.json existe
    const localStoragePath = path.join(process.cwd(), 'localStorage.json');
    
    let localStorage = {};
    
    if (fs.existsSync(localStoragePath)) {
      // Ler o conteúdo do localStorage
      const data = fs.readFileSync(localStoragePath, 'utf8');
      localStorage = JSON.parse(data);
    }
    
    // Verificar se há geradoras no localStorage
    if (!localStorage.geradoras) {
      localStorage.geradoras = "[]";
    }
    
    // Converter a string JSON para array
    let geradoras = JSON.parse(localStorage.geradoras);
    
    // Verificar se a geradora já existe
    const geradoraExistente = geradoras.find(g => g.email === email);
    
    if (geradoraExistente) {
      console.log(`Geradora com email ${email} já existe no localStorage. Atualizando...`);
      
      // Atualizar a geradora existente
      Object.assign(geradoraExistente, {
        nome,
        senha: password,
        cnpj,
        responsavel,
        telefone,
        status: 'ativo',
        updatedAt: new Date().toISOString()
      });
    } else {
      // Criar nova geradora
      const novaGeradora = {
        id: `geradora-${Date.now()}`,
        email,
        nome,
        role: 'geradora',
        isApproved: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cnpj,
        responsavel,
        telefone,
        status: 'ativo',
        senha: password
      };
      
      // Adicionar à lista
      geradoras.push(novaGeradora);
      console.log(`Geradora ${nome} adicionada ao localStorage.`);
    }
    
    // Converter array de volta para string JSON
    localStorage.geradoras = JSON.stringify(geradoras);
    
    // Salvar no arquivo localStorage.json
    fs.writeFileSync(localStoragePath, JSON.stringify(localStorage, null, 2));
    console.log(`Arquivo ${localStoragePath} atualizado com sucesso.`);
    
    // Também atualizar o arquivo local-storage-mock.json para testes
    const mockPath = path.join(process.cwd(), 'local-storage-mock.json');
    
    if (fs.existsSync(mockPath)) {
      let mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
      
      // Verificar se a geradora já existe
      const mockGeradoraIndex = mockData.geradoras.findIndex(g => g.email === email);
      
      if (mockGeradoraIndex >= 0) {
        // Atualizar a geradora existente
        mockData.geradoras[mockGeradoraIndex] = {
          ...mockData.geradoras[mockGeradoraIndex],
          nome,
          senha: password,
          cnpj,
          responsavel,
          telefone,
          status: 'ativo',
          updatedAt: new Date().toISOString()
        };
      } else {
        // Adicionar nova geradora
        mockData.geradoras.push({
          id: `geradora-${Date.now()}`,
          email,
          nome,
          role: 'geradora',
          isApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cnpj,
          responsavel,
          telefone,
          status: 'ativo',
          senha: password
        });
      }
      
      // Salvar no arquivo mock
      fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));
      console.log(`Arquivo ${mockPath} atualizado com sucesso.`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao adicionar geradora ao localStorage:', error);
    return false;
  }
}

// Função principal
function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];
  const nome = args[2] || `Geradora ${email.split('@')[0]}`;
  const cnpj = args[3] || '12345678000199';
  const responsavel = args[4] || 'Responsável';
  const telefone = args[5] || '(11) 99999-9999';

  if (!email || !password) {
    console.error('Uso: node add-geradora-to-localstorage.js <email> <senha> [nome] [cnpj] [responsavel] [telefone]');
    process.exit(1);
  }

  // Executar a adição
  try {
    const success = addGeradoraToLocalStorage(email, password, nome, cnpj, responsavel, telefone);
    
    if (success) {
      console.log('\nGeradora adicionada com sucesso!');
      process.exit(0);
    } else {
      console.error('\nFalha ao adicionar geradora.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
