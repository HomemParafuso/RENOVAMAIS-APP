// Script para adicionar um usuário admin diretamente no Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtuXGBamvZgXOC5ZAQPDk5YAklxqQ6-9c",
  authDomain: "renovamaisapp.firebaseapp.com",
  projectId: "renovamaisapp",
  storageBucket: "renovamaisapp.appspot.com",
  messagingSenderId: "858470766160",
  appId: "1:858470766160:web:7c5b81dbf865db4402a355",
  measurementId: "G-XXXXXXXXXX"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID fixo para o usuário admin (para facilitar a referência)
const ADMIN_ID = 'admin-user-123456';

// Função para adicionar o usuário admin
async function addAdminToFirestore() {
  try {
    // Dados do usuário admin
    const adminData = {
      email: 'pabllo.tca@gmail.com',
      name: 'Admin',
      role: 'admin',
      isApproved: true,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };

    // Adicionar ao Firestore com ID fixo
    await setDoc(doc(db, 'users', ADMIN_ID), adminData);
    
    console.log('Usuário admin adicionado ao Firestore com ID:', ADMIN_ID);
  } catch (error) {
    console.error('Erro ao adicionar usuário admin ao Firestore:', error);
  }
}

// Executar a função
addAdminToFirestore()
  .then(() => {
    console.log('Script concluído.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro no script:', error);
    process.exit(1);
  });
