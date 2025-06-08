// Script para verificar se a geradora existe no Firebase e tentar fazer login
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Importar dotenv para carregar variáveis de ambiente
import { config } from 'dotenv';
config();

// Configuração do Firebase
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
const auth = getAuth(app);
const db = getFirestore(app);

// Email e senha para testar
const email = "ptacyanno@gmail.com";
const password = "!Binho102030";

console.log(`Verificando geradora com email: ${email}`);

// Função para verificar se o usuário existe no Firestore
async function checkUserInFirestore() {
  try {
    // Importar as funções necessárias
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    // Buscar usuários com o email fornecido
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('Nenhum usuário encontrado com este email no Firestore');
      return null;
    }

    console.log(`Encontrados ${snapshot.size} usuários com este email`);
    
    // Verificar cada documento
    snapshot.forEach(doc => {
      console.log('ID do documento:', doc.id);
      console.log('Dados do documento:', doc.data());
    });

    return snapshot.docs[0];
  } catch (error) {
    console.error('Erro ao verificar usuário no Firestore:', error);
    return null;
  }
}

// Tentar fazer login
async function attemptLogin() {
  try {
    console.log(`Tentando fazer login com email: ${email} e senha: ${password}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Login bem-sucedido
    const user = userCredential.user;
    console.log("Login bem-sucedido!");
    console.log("UID do usuário:", user.uid);
    console.log("Email do usuário:", user.email);
    console.log("Email verificado:", user.emailVerified);
    
    // Verificar dados do usuário no Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log("Dados do usuário no Firestore:", userDoc.data());
      } else {
        console.log("Usuário não encontrado no Firestore");
      }
    } catch (firestoreError) {
      console.error("Erro ao buscar dados do usuário no Firestore:", firestoreError);
    }
    
    return user;
  } catch (error) {
    // Erro no login
    console.error("Erro ao fazer login:");
    console.error("Código do erro:", error.code);
    console.error("Mensagem do erro:", error.message);
    return null;
  }
}

// Executar verificações
async function runChecks() {
  try {
    // Primeiro, verificar se o usuário existe no Firestore
    await checkUserInFirestore();
    
    // Depois, tentar fazer login
    const user = await attemptLogin();
    
    if (user) {
      console.log("Verificação completa: Usuário existe e login bem-sucedido");
    } else {
      console.log("Verificação completa: Login falhou");
    }
  } catch (error) {
    console.error("Erro durante as verificações:", error);
  }
}

runChecks();
