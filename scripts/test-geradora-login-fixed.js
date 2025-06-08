// Script para testar o login da geradora após a correção
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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
const auth = getAuth(app);
const db = getFirestore(app);

// Email e senha da geradora
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
    
    // Verificar dados do usuário no Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log("Dados do usuário no Firestore:", userDoc.data());
        
        // Verificar a role do usuário
        const userData = userDoc.data();
        console.log("Role do usuário:", userData.role);
        
        // Verificar para qual rota o usuário seria redirecionado
        if (userData.role === 'admin') {
          console.log("Usuário seria redirecionado para: /admin");
        } else if (userData.role === 'geradora') {
          console.log("Usuário seria redirecionado para: /geradora");
        } else if (userData.role === 'client') {
          console.log("Usuário seria redirecionado para: /cliente");
        } else {
          console.log("Role desconhecida, redirecionamento padrão para: /dashboard");
        }
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

// Executar login
attemptLogin()
  .then(user => {
    if (user) {
      console.log("\n--- RESUMO ---");
      console.log("Login bem-sucedido com a geradora");
      console.log("A geradora agora pode acessar o sistema");
    } else {
      console.log("\n--- RESUMO ---");
      console.log("Login falhou com a geradora");
      console.log("Verifique as credenciais e a configuração do Firebase");
    }
  })
  .catch(error => {
    console.error("Erro durante a verificação:", error);
  });
