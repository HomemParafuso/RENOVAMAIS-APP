// Script para testar o login de uma geradora específica
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtuXGBamyZqXOC5ZAQPDk5YAklxqQ6-9c",
  authDomain: "renovamaisapp.firebaseapp.com",
  projectId: "renovamaisapp",
  storageBucket: "renovamaisapp.appspot.com",
  messagingSenderId: "858470766160",
  appId: "1:858470766160:web:7c5b81dbf865db4402a355",
  measurementId: "G-XXXXXXXXXX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para testar o login
async function testarLogin(email, senha) {
  try {
    console.log(`\nTentando fazer login com: ${email}`);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    console.log('\n=== LOGIN BEM-SUCEDIDO ===');
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email verificado: ${user.emailVerified}`);
    
    return true;
  } catch (error) {
    console.error('\n=== ERRO DE LOGIN ===');
    console.error(`Código: ${error.code}`);
    console.error(`Mensagem: ${error.message}`);
    
    if (error.code === 'auth/invalid-credential') {
      console.log('\nDica: Verifique se o email e a senha estão corretos.');
    } else if (error.code === 'auth/user-not-found') {
      console.log('\nDica: Este usuário não existe no Firebase Authentication.');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\nDica: A senha está incorreta.');
    }
    
    return false;
  }
}

// Obter email e senha dos argumentos da linha de comando
const args = process.argv.slice(2);
const email = args[0];
const senha = args[1];

if (!email || !senha) {
  console.log('\nUso: node scripts/test-geradora-login.js <email> <senha>');
  console.log('Exemplo: node scripts/test-geradora-login.js geradora@exemplo.com minhasenha123');
  process.exit(1);
}

// Executar o teste de login
testarLogin(email, senha).then((sucesso) => {
  if (sucesso) {
    console.log('\nLogin bem-sucedido! O usuário existe e as credenciais estão corretas.');
  } else {
    console.log('\nFalha no login. Verifique as mensagens de erro acima.');
  }
}).catch((error) => {
  console.error('Erro inesperado:', error);
});
