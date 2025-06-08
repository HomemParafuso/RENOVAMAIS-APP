// Script para criar um usuário admin no Firebase Authentication
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

// Dados do usuário admin
const adminEmail = 'pabllo.tca@gmail.com';
const adminPassword = 'admin123'; // Altere para uma senha segura

// Função para criar o usuário admin
async function createAdminUser() {
  try {
    // Tentar fazer login primeiro para verificar se o usuário já existe
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Usuário admin já existe. Login realizado com sucesso.');
      return;
    } catch (loginError) {
      // Se o login falhar, verificar se é porque o usuário não existe
      if (loginError.code === 'auth/user-not-found') {
        console.log('Usuário admin não encontrado. Criando novo usuário...');
      } else if (loginError.code === 'auth/wrong-password') {
        console.log('Usuário admin existe, mas a senha está incorreta.');
        return;
      } else {
        console.error('Erro ao fazer login:', loginError.code, loginError.message);
        return;
      }
    }

    // Criar o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Criar o documento do usuário no Firestore
    const now = new Date();
    await setDoc(doc(db, 'users', user.uid), {
      email: adminEmail,
      name: 'Admin',
      role: 'admin',
      isApproved: true,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    });

    console.log('Usuário admin criado com sucesso:', user.uid);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error.code, error.message);
  }
}

// Executar a função
createAdminUser()
  .then(() => {
    console.log('Script concluído.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro no script:', error);
    process.exit(1);
  });
