// Script para inicializar o Firebase Firestore com dados de exemplo
// Execute este script com: node scripts/firebase-init-data.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Carregue as credenciais do arquivo de serviço
// Você precisa baixar este arquivo do console do Firebase
// Projeto > Configurações > Contas de serviço > Gerar nova chave privada
const serviceAccount = require('../serviceAccountKey.json');

// Inicialize o app Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Função para criar um timestamp
const createTimestamp = (date) => {
  return Timestamp.fromDate(date || new Date());
};

// Função para criar um usuário
async function createUser(userData) {
  const userRef = db.collection('users').doc(userData.id);
  
  // Adicionar timestamps
  const now = new Date();
  const userWithTimestamps = {
    ...userData,
    createdAt: createTimestamp(now),
    updatedAt: createTimestamp(now)
  };
  
  await userRef.set(userWithTimestamps);
  console.log(`Usuário criado: ${userData.name} (${userData.id})`);
  
  return userData.id;
}

// Função para criar uma fatura
async function createFatura(faturaData) {
  const faturaRef = db.collection('faturas').doc();
  
  // Adicionar timestamps
  const now = new Date();
  const faturaWithTimestamps = {
    ...faturaData,
    createdAt: createTimestamp(now),
    updatedAt: createTimestamp(now),
    dueDate: createTimestamp(faturaData.dueDate)
  };
  
  await faturaRef.set(faturaWithTimestamps);
  console.log(`Fatura criada: ${faturaRef.id} (R$ ${faturaData.amount} - ${faturaData.status})`);
  
  return faturaRef.id;
}

// Função principal para inicializar os dados
async function initializeData() {
  try {
    console.log('Iniciando a inicialização de dados...');
    
    // Criar usuários
    const adminId = await createUser({
      id: 'admin123',
      email: 'admin@renovamais.com.br',
      name: 'Administrador',
      role: 'admin',
      isApproved: true
    });
    
    const clientId1 = await createUser({
      id: 'client123',
      email: 'cliente1@exemplo.com',
      name: 'João Silva',
      role: 'client',
      isApproved: true
    });
    
    const clientId2 = await createUser({
      id: 'client456',
      email: 'cliente2@exemplo.com',
      name: 'Maria Oliveira',
      role: 'client',
      isApproved: true
    });
    
    const geradoraId = await createUser({
      id: 'geradora123',
      email: 'geradora@exemplo.com',
      name: 'Energia Solar Ltda',
      role: 'geradora',
      isApproved: true
    });
    
    // Criar faturas para o cliente 1
    await createFatura({
      userId: clientId1,
      amount: 150.75,
      dueDate: new Date('2025-06-10'),
      status: 'pending',
      description: 'Fatura de energia - Junho/2025',
      reference: '06/2025'
    });
    
    await createFatura({
      userId: clientId1,
      amount: 142.30,
      dueDate: new Date('2025-05-10'),
      status: 'paid',
      description: 'Fatura de energia - Maio/2025',
      reference: '05/2025'
    });
    
    await createFatura({
      userId: clientId1,
      amount: 165.20,
      dueDate: new Date('2025-04-10'),
      status: 'paid',
      description: 'Fatura de energia - Abril/2025',
      reference: '04/2025'
    });
    
    // Criar faturas para o cliente 2
    await createFatura({
      userId: clientId2,
      amount: 210.45,
      dueDate: new Date('2025-06-15'),
      status: 'pending',
      description: 'Fatura de energia - Junho/2025',
      reference: '06/2025'
    });
    
    await createFatura({
      userId: clientId2,
      amount: 198.60,
      dueDate: new Date('2025-05-15'),
      status: 'overdue',
      description: 'Fatura de energia - Maio/2025',
      reference: '05/2025'
    });
    
    // Criar coleção de configurações
    const configRef = db.collection('configuracoes').doc('sistema');
    await configRef.set({
      taxaKwh: 0.75,
      diasVencimento: 10,
      notificacaoAntecedencia: 5,
      updatedAt: createTimestamp()
    });
    
    console.log('Inicialização de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}

// Executar a função principal
initializeData();
