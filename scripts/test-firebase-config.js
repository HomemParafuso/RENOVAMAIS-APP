// Script para testar a configuração do Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

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

console.log('Configuração do Firebase:', firebaseConfig);

async function testFirebase() {
  try {
    // Inicializar o Firebase
    const app = initializeApp(firebaseConfig);
    console.log('Firebase inicializado com sucesso');

    // Testar Firestore
    const db = getFirestore(app);
    console.log('Firestore inicializado');

    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      console.log(`Firestore funcionando! Encontrados ${usersSnapshot.size} usuários.`);
      usersSnapshot.forEach(doc => {
        console.log(`Usuário: ${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    } catch (firestoreError) {
      console.error('Erro ao acessar o Firestore:', firestoreError);
    }

    // Testar Authentication
    const auth = getAuth(app);
    console.log('Auth inicializado');

    try {
      // Tente fazer login com o usuário admin
      const email = 'pabllo.tca@gmail.com';
      const password = 'senha123'; // Substitua pela senha correta
      
      console.log(`Tentando fazer login com ${email}`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido!', userCredential.user);
    } catch (authError) {
      console.error('Erro ao fazer login:', authError.code, authError.message);
    }

  } catch (error) {
    console.error('Erro ao inicializar o Firebase:', error);
  }
}

testFirebase();
