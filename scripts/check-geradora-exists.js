#!/usr/bin/env node
// Script para verificar se uma geradora existe no Firebase
// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDtuXGBamvZgXOC5ZAQPDk5YAklxqG-9c',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'renovamaisapp.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'renovamaisapp',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'renovamaisapp.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '858470766160',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:858470766160:web:7c5b81dbf865db4402a355',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

console.log('Configuração do Firebase:', firebaseConfig);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para verificar se uma geradora existe no Firebase
async function checkGeradoraExists(email) {
  console.log(`Verificando se a geradora com email ${email} existe no Firebase...`);
  
  try {
    // Verificar se o Firebase está disponível
    const isFirebaseAvailable = await checkFirebaseConnection();
    
    if (!isFirebaseAvailable) {
      console.error('Firebase não está disponível. Não é possível verificar.');
      return false;
    }
    
    // Buscar geradora pelo email
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('email', '==', email),
      where('role', '==', 'geradora')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`Geradora com email ${email} não encontrada no Firebase.`);
      return false;
    }
    
    // Exibir dados da geradora
    const geradoraDoc = querySnapshot.docs[0];
    const geradoraData = geradoraDoc.data();
    
    console.log('\nGeradora encontrada no Firebase:');
    console.log('ID:', geradoraDoc.id);
    console.log('Nome:', geradoraData.nome);
    console.log('Email:', geradoraData.email);
    console.log('Papel:', geradoraData.role);
    console.log('Status:', geradoraData.status);
    console.log('Aprovado:', geradoraData.isApproved);
    console.log('CNPJ:', geradoraData.cnpj);
    console.log('Responsável:', geradoraData.responsavel);
    console.log('Telefone:', geradoraData.telefone);
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar geradora:', error);
    return false;
  }
}

// Função para verificar se o Firebase está disponível
async function checkFirebaseConnection() {
  try {
    // Tentar acessar um documento para verificar a conexão
    const usersRef = collection(db, 'users');
    await getDocs(query(usersRef, where('role', '==', 'admin'), where('email', '==', 'pabllo.tca@gmail.com')));
    console.log('Firebase está disponível.');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão com Firebase:', error);
    return false;
  }
}

// Função para verificar se uma geradora existe no localStorage
async function checkLocalGeradoraExists(email) {
  console.log(`Verificando se a geradora com email ${email} existe no localStorage...`);
  
  try {
    // Ler geradoras do localStorage (simulado)
    const localStoragePath = 'local-storage-mock.json';
    const fs = await import('fs');
    const path = await import('path');
    
    if (!fs.existsSync(localStoragePath)) {
      console.log('Arquivo local-storage-mock.json não encontrado.');
      return false;
    }
    
    const data = fs.readFileSync(localStoragePath, 'utf8');
    const parsedData = JSON.parse(data);
    const geradoras = parsedData.geradoras || [];
    
    // Procurar geradora pelo email
    const geradora = geradoras.find(g => g.email === email);
    
    if (!geradora) {
      console.log(`Geradora com email ${email} não encontrada no localStorage.`);
      return false;
    }
    
    console.log('\nGeradora encontrada no localStorage:');
    console.log('ID:', geradora.id);
    console.log('Nome:', geradora.nome);
    console.log('Email:', geradora.email);
    console.log('Papel:', geradora.role);
    console.log('Status:', geradora.status);
    console.log('Aprovado:', geradora.isApproved);
    console.log('CNPJ:', geradora.cnpj);
    console.log('Responsável:', geradora.responsavel);
    console.log('Telefone:', geradora.telefone);
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar geradora no localStorage:', error);
    return false;
  }
}

// Função principal
async function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const checkLocal = args[1] === '--local';

  if (!email) {
    console.error('Uso: node check-geradora-exists.js <email> [--local]');
    process.exit(1);
  }

  // Executar a verificação
  try {
    let exists = false;
    
    if (checkLocal) {
      exists = await checkLocalGeradoraExists(email);
    } else {
      exists = await checkGeradoraExists(email);
      
      // Se não encontrou no Firebase, verificar também no localStorage
      if (!exists) {
        console.log('\nVerificando também no localStorage...');
        exists = await checkLocalGeradoraExists(email);
      }
    }
    
    if (exists) {
      console.log('\nGeradora encontrada!');
      process.exit(0);
    } else {
      console.error('\nGeradora não encontrada!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro na verificação:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
