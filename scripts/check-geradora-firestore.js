// Script para verificar se a geradora existe no Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
config();

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log("Usando configuração Firebase:", firebaseConfig);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UID da geradora obtido do Firebase Authentication
const geradoraUID = "VfZhEb7mn9cRhvOvsF3PB9qVDWb2";
const geradoraEmail = "ptacyanno@gmail.com";

// Verificar se a geradora existe no Firestore pelo UID
async function checkGeradoraByUID() {
  try {
    console.log(`Verificando geradora com UID: ${geradoraUID}`);
    const docRef = doc(db, 'users', geradoraUID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Documento da geradora encontrado pelo UID!");
      console.log("Dados da geradora:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("Nenhum documento encontrado com este UID");
      return null;
    }
  } catch (error) {
    console.error("Erro ao verificar geradora pelo UID:", error);
    return null;
  }
}

// Verificar se a geradora existe no Firestore pelo email
async function checkGeradoraByEmail() {
  try {
    console.log(`Verificando geradora com email: ${geradoraEmail}`);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', geradoraEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Nenhum documento encontrado com este email");
      return null;
    }
    
    console.log(`Encontrados ${querySnapshot.size} documentos com este email`);
    
    querySnapshot.forEach((doc) => {
      console.log("ID do documento:", doc.id);
      console.log("Dados do documento:", doc.data());
    });
    
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Erro ao verificar geradora pelo email:", error);
    return null;
  }
}

// Executar verificações
async function runChecks() {
  try {
    // Verificar pelo UID
    const geradoraByUID = await checkGeradoraByUID();
    
    // Verificar pelo email
    const geradoraByEmail = await checkGeradoraByEmail();
    
    // Resumo
    console.log("\n--- RESUMO ---");
    console.log("Geradora encontrada pelo UID:", geradoraByUID ? "SIM" : "NÃO");
    console.log("Geradora encontrada pelo email:", geradoraByEmail ? "SIM" : "NÃO");
    
    if (geradoraByUID || geradoraByEmail) {
      console.log("A geradora está cadastrada no Firestore");
    } else {
      console.log("A geradora NÃO está cadastrada no Firestore");
      console.log("Isso pode explicar por que o login está falhando, mesmo com o usuário existindo no Authentication");
    }
  } catch (error) {
    console.error("Erro durante as verificações:", error);
  }
}

runChecks();
