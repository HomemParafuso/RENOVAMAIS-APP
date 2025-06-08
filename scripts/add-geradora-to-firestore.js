// Script para adicionar a geradora ao Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
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

// Dados da geradora para adicionar ao Firestore
const geradoraData = {
  email: geradoraEmail,
  name: "Geradora Solar",
  role: "geradora",
  isApproved: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
};

// Adicionar a geradora ao Firestore
async function addGeradoraToFirestore() {
  try {
    console.log(`Adicionando geradora com UID: ${geradoraUID} ao Firestore`);
    console.log("Dados da geradora:", geradoraData);
    
    // Usar o UID do Authentication como ID do documento no Firestore
    await setDoc(doc(db, 'users', geradoraUID), geradoraData);
    
    console.log("Geradora adicionada com sucesso ao Firestore!");
    return true;
  } catch (error) {
    console.error("Erro ao adicionar geradora ao Firestore:", error);
    return false;
  }
}

// Executar a adição
addGeradoraToFirestore()
  .then(success => {
    if (success) {
      console.log("\n--- RESUMO ---");
      console.log("Geradora adicionada com sucesso ao Firestore");
      console.log("Agora o login deve funcionar corretamente");
      console.log("Você pode verificar executando: npm run check:firestore");
    } else {
      console.log("\n--- RESUMO ---");
      console.log("Falha ao adicionar a geradora ao Firestore");
    }
  })
  .catch(error => {
    console.error("Erro durante a execução:", error);
  });
