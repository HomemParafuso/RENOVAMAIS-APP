// Script para verificar se o usuário admin existe no Firebase Authentication
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

// Dados do usuário admin
const adminEmail = 'pabllo.tca@gmail.com';
const adminPassword = 'admin123'; // Altere para a senha correta

// Função para verificar o usuário admin
async function checkAdminUser() {
  try {
    // Tentar fazer login para verificar se o usuário existe
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    console.log('Login realizado com sucesso. UID do usuário:', user.uid);
  } catch (error) {
    console.error('Erro ao fazer login:', error.code, error.message);
  }
}

// Executar a função
checkAdminUser()
  .then(() => {
    console.log('Script concluído.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro no script:', error);
    process.exit(1);
  });
