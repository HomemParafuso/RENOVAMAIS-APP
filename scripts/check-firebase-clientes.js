// Script para verificar os clientes no Firebase
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

// Função para buscar todos os clientes
async function getClientes() {
  try {
    console.log('Buscando clientes no Firebase...');
    
    const clientesCollection = collection(db, 'clientes');
    const clientesSnapshot = await getDocs(clientesCollection);
    
    if (clientesSnapshot.empty) {
      console.log('Nenhum cliente encontrado no Firebase.');
      return;
    }
    
    console.log(`Encontrados ${clientesSnapshot.size} clientes no Firebase:`);
    console.log('---------------------------------------------');
    
    clientesSnapshot.forEach((doc) => {
      const cliente = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Nome: ${cliente.nome}`);
      console.log(`Email: ${cliente.email}`);
      console.log(`CPF/CNPJ: ${cliente.cpf}`);
      console.log(`Status: ${cliente.status}`);
      console.log(`Data de criação: ${cliente.createdAt?.toDate?.() || cliente.createdAt}`);
      console.log('---------------------------------------------');
    });
    
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
}

// Executar a função
getClientes();
