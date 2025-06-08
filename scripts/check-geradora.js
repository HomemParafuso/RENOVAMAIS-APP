// Script para verificar as geradoras no Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
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
const db = getFirestore(app);
const auth = getAuth(app);

// Função para listar todas as geradoras
async function listarGeradoras() {
  try {
    // Consultar todas as geradoras
    const geradorasQuery = query(
      collection(db, 'users'),
      where('role', '==', 'geradora')
    );
    
    const querySnapshot = await getDocs(geradorasQuery);
    
    console.log('\n=== GERADORAS CADASTRADAS ===\n');
    
    if (querySnapshot.empty) {
      console.log('Nenhuma geradora encontrada no banco de dados.');
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Nome: ${data.nome}`);
      console.log(`Email: ${data.email}`);
      console.log(`Responsável: ${data.responsavel}`);
      console.log(`Status: ${data.status}`);
      console.log(`Data de Cadastro: ${data.createdAt.toDate()}`);
      console.log('----------------------------');
    });
    
    console.log('\nOBS: As senhas não são armazenadas no Firestore, apenas no Firebase Authentication.');
    console.log('Para testar o login de uma geradora, use o email e a senha que você definiu ao criar a geradora.');
    console.log('Se você esqueceu a senha, pode usar a função de redefinição de senha do Firebase Authentication.');
    
  } catch (error) {
    console.error('Erro ao listar geradoras:', error);
  }
}

// Função para verificar se é possível fazer login com uma geradora
async function testarLoginGeradora(email, senha) {
  try {
    console.log(`\nTentando fazer login com a geradora: ${email}`);
    
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
    
    return false;
  }
}

// Executar as funções
async function main() {
  // Listar todas as geradoras
  await listarGeradoras();
  
  // Se quiser testar o login de uma geradora específica, descomente as linhas abaixo
  // e substitua o email e senha pelos valores corretos
  /*
  const email = 'email-da-geradora@exemplo.com';
  const senha = 'senha-da-geradora';
  await testarLoginGeradora(email, senha);
  */
}

// Executar a função principal
main().then(() => {
  console.log('\nVerificação concluída!');
}).catch((error) => {
  console.error('Erro na execução do script:', error);
});
