// Script para verificar as geradoras no Firebase
// Execute este script com Node.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para buscar todas as geradoras
async function getGeradoras() {
  try {
    console.log('Buscando geradoras no Firebase...');
    
    const geradorasCollection = collection(db, 'geradoras');
    const geradorasSnapshot = await getDocs(geradorasCollection);
    
    if (geradorasSnapshot.empty) {
      console.log('Nenhuma geradora encontrada no Firebase.');
      return;
    }
    
    console.log(`Encontradas ${geradorasSnapshot.size} geradoras no Firebase:`);
    console.log('---------------------------------------------');
    
    geradorasSnapshot.forEach((doc) => {
      const geradora = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Nome: ${geradora.nome}`);
      console.log(`Email: ${geradora.email}`);
      console.log(`Responsável: ${geradora.responsavel}`);
      console.log(`CNPJ: ${geradora.cnpj}`);
      console.log(`Status: ${geradora.status}`);
      console.log(`Data de cadastro: ${geradora.dataCadastro}`);
      console.log(`Limite de usuários: ${geradora.limiteUsuarios}`);
      console.log(`Usuários ativos: ${geradora.usuariosAtivos}`);
      console.log('---------------------------------------------');
    });
    
  } catch (error) {
    console.error('Erro ao buscar geradoras:', error);
  }
}

// Função para verificar as geradoras salvas localmente
function checkLocalGeradoras() {
  try {
    console.log('Verificando geradoras salvas localmente...');
    
    const geradorasSalvas = localStorage.getItem('geradoras');
    if (!geradorasSalvas) {
      console.log('Nenhuma geradora encontrada no localStorage.');
      return;
    }
    
    const geradoras = JSON.parse(geradorasSalvas);
    console.log(`Encontradas ${geradoras.length} geradoras no localStorage:`);
    console.log('---------------------------------------------');
    
    geradoras.forEach((geradora) => {
      console.log(`ID: ${geradora.id}`);
      console.log(`Nome: ${geradora.nome}`);
      console.log(`Email: ${geradora.email}`);
      console.log(`Responsável: ${geradora.responsavel}`);
      console.log(`CNPJ: ${geradora.cnpj}`);
      console.log(`Status: ${geradora.status}`);
      console.log(`Data de cadastro: ${geradora.dataCadastro}`);
      console.log(`Limite de usuários: ${geradora.limiteUsuarios}`);
      console.log(`Usuários ativos: ${geradora.usuariosAtivos}`);
      console.log('---------------------------------------------');
    });
    
  } catch (error) {
    console.error('Erro ao verificar geradoras locais:', error);
  }
}

// Função para verificar operações pendentes
function checkPendingOperations() {
  try {
    console.log('Verificando operações pendentes...');
    
    const pendingOperations = localStorage.getItem('pendingOperations');
    if (!pendingOperations) {
      console.log('Nenhuma operação pendente encontrada.');
      return;
    }
    
    const operations = JSON.parse(pendingOperations);
    const geradoraOperations = operations.filter(op => op.collection === 'geradoras');
    
    if (geradoraOperations.length === 0) {
      console.log('Nenhuma operação pendente para geradoras.');
      return;
    }
    
    console.log(`Encontradas ${geradoraOperations.length} operações pendentes para geradoras:`);
    console.log('---------------------------------------------');
    
    geradoraOperations.forEach((op, index) => {
      console.log(`Operação #${index + 1}:`);
      console.log(`Tipo: ${op.type}`);
      console.log(`Coleção: ${op.collection}`);
      if (op.entityId) console.log(`ID da entidade: ${op.entityId}`);
      console.log(`Dados: ${JSON.stringify(op.data, null, 2)}`);
      console.log('---------------------------------------------');
    });
    
  } catch (error) {
    console.error('Erro ao verificar operações pendentes:', error);
  }
}

// Executar as funções
async function main() {
  try {
    // Verificar geradoras no Firebase
    await getGeradoras();
    
    // Como estamos em um ambiente Node.js, não temos acesso ao localStorage
    console.log('\nNota: As funções para verificar geradoras locais e operações pendentes');
    console.log('não podem ser executadas em Node.js, pois dependem do localStorage do navegador.');
    console.log('Para verificar esses dados, você precisaria executar código similar no console do navegador.');
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
  }
}

main();
