// Script para testar o login no Firebase com chave de API direta
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuração do Firebase com chave de API direta
const firebaseConfig = {
  apiKey: "AIzaSyDtuXGBamyZqXOC5ZAQPDk5YAklxqQ6-9c",
  authDomain: "renovamaisapp.firebaseapp.com",
  projectId: "renovamaisapp",
  storageBucket: "renovamaisapp.appspot.com",
  messagingSenderId: "858470766160",
  appId: "1:858470766160:web:7c5b81dbf865db4402a355"
};

console.log("Usando configuração Firebase:", firebaseConfig);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email e senha para testar
const email = "ptacyanno@gmail.com";
const password = "!Binho102030";

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
    
    return user;
  } catch (error) {
    // Erro no login
    console.error("Erro ao fazer login:");
    console.error("Código do erro:", error.code);
    console.error("Mensagem do erro:", error.message);
    return null;
  }
}

// Executar login
attemptLogin()
  .then(user => {
    if (user) {
      console.log("Verificação completa: Login bem-sucedido");
    } else {
      console.log("Verificação completa: Login falhou");
    }
  })
  .catch(error => {
    console.error("Erro durante a verificação:", error);
  });
