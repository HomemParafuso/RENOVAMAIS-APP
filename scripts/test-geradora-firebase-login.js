#!/usr/bin/env node
// Script para testar o login de uma geradora usando o Firebase
// @ts-check
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// Verificar se as variáveis de ambiente foram carregadas
console.log('Variáveis de ambiente carregadas:');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', process.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', process.env.VITE_FIREBASE_PROJECT_ID);

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
const auth = getAuth(app);
const db = getFirestore(app);

// Função para testar o login de uma geradora
async function testGeradoraLogin(email, password) {
  console.log(`Tentando fazer login com email: ${email}`);
  
  try {
    // Autenticar com Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Login bem-sucedido no Firebase Authentication:');
    console.log('UID:', user.uid);
    console.log('Email:', user.email);
    
    // Verificar se o usuário é uma geradora
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('email', '==', email),
      where('role', '==', 'geradora')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('Erro: Usuário não é uma geradora!');
      await signOut(auth);
      return;
    }
    
    // Exibir dados da geradora
    const geradoraDoc = querySnapshot.docs[0];
    const geradoraData = geradoraDoc.data();
    
    console.log('\nDados da geradora encontrados no Firestore:');
    console.log('ID:', geradoraDoc.id);
    console.log('Nome:', geradoraData.nome);
    console.log('Email:', geradoraData.email);
    console.log('Papel:', geradoraData.role);
    console.log('Status:', geradoraData.status);
    console.log('Aprovado:', geradoraData.isApproved);
    console.log('CNPJ:', geradoraData.cnpj);
    console.log('Responsável:', geradoraData.responsavel);
    console.log('Telefone:', geradoraData.telefone);
    
    // Fazer logout
    await signOut(auth);
    console.log('\nLogout realizado com sucesso');
    
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    if (error.code) {
      console.error('Código do erro:', error.code);
    }
  }
}

// Função principal
async function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];

  if (!email || !password) {
    console.error('Uso: node test-geradora-firebase-login.js <email> <senha>');
    process.exit(1);
  }

  // Executar o teste
  try {
    await testGeradoraLogin(email, password);
    console.log('Teste concluído');
    process.exit(0);
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
