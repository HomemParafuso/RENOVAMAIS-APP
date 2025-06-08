// Script para testar o login de uma geradora
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtuXGBamyZqXOC5ZAQPDk5YAklxqQ6-9c",
  authDomain: "renovamaisapp.firebaseapp.com",
  projectId: "renovamaisapp",
  storageBucket: "renovamaisapp.appspot.com",
  messagingSenderId: "858470766160",
  appId: "1:858470766160:web:7c5b81dbf865db4402a355"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email e senha para testar
const email = "ptacyanno@gmail.com";
const password = process.argv[2] || "senha123"; // Pegar a senha como argumento ou usar padrão

console.log(`Tentando fazer login com email: ${email} e senha: ${password}`);

// Tentar fazer login
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Login bem-sucedido
    const user = userCredential.user;
    console.log("Login bem-sucedido!");
    console.log("UID do usuário:", user.uid);
    console.log("Email do usuário:", user.email);
    console.log("Email verificado:", user.emailVerified);
  })
  .catch((error) => {
    // Erro no login
    console.error("Erro ao fazer login:");
    console.error("Código do erro:", error.code);
    console.error("Mensagem do erro:", error.message);
  });
