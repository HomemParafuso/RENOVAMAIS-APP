// Script para testar o acesso ao sistema através do endereço http://192.168.1.133:8080/
// Execute este script com Node.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, setDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

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

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para buscar todas as geradoras
async function getGeradoras() {
  try {
    console.log('Buscando geradoras no Firebase...');
    
    const geradorasCollection = collection(db, 'geradoras');
    const geradorasSnapshot = await getDocs(geradorasCollection);
    
    if (geradorasSnapshot.empty) {
      console.log('Nenhuma geradora encontrada na coleção "geradoras".');
      
      // Tentar buscar na coleção "users" com role="geradora"
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'geradora'));
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        console.log('Nenhuma geradora encontrada na coleção "users".');
        return [];
      }
      
      console.log(`Encontradas ${usersSnapshot.size} geradoras na coleção "users":`);
      
      const geradoras = [];
      usersSnapshot.forEach((doc) => {
        const geradora = doc.data();
        geradora.id = doc.id;
        geradoras.push(geradora);
        
        console.log(`- ${geradora.nome || 'Nome não definido'} (ID: ${doc.id})`);
        console.log(`  Email: ${geradora.email}`);
      });
      
      return geradoras;
    }
    
    console.log(`Encontradas ${geradorasSnapshot.size} geradoras na coleção "geradoras":`);
    
    const geradoras = [];
    geradorasSnapshot.forEach((doc) => {
      const geradora = doc.data();
      geradora.id = doc.id;
      geradoras.push(geradora);
      
      console.log(`- ${geradora.nome || geradora.geradora || 'Nome não definido'} (ID: ${doc.id})`);
      console.log(`  Email: ${geradora.email}`);
    });
    
    return geradoras;
  } catch (error) {
    console.error('Erro ao buscar geradoras:', error);
    return [];
  }
}

// Função para buscar todos os clientes
async function getClientes() {
  try {
    console.log('Buscando clientes no Firebase...');
    
    const clientesCollection = collection(db, 'clientes');
    const clientesSnapshot = await getDocs(clientesCollection);
    
    if (clientesSnapshot.empty) {
      console.log('Nenhum cliente encontrado no Firebase.');
      return [];
    }
    
    console.log(`Encontrados ${clientesSnapshot.size} clientes no Firebase:`);
    
    const clientes = [];
    clientesSnapshot.forEach((doc) => {
      const cliente = doc.data();
      cliente.id = doc.id;
      clientes.push(cliente);
      
      console.log(`- ${cliente.nome || 'Nome não definido'} (ID: ${doc.id})`);
      console.log(`  Email: ${cliente.email}`);
    });
    
    return clientes;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

// Função para testar o login da geradora
async function testGeradoraLogin(email, senha) {
  try {
    console.log(`\nTestando login da geradora com email: ${email}`);
    
    // Tentar fazer login com o Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    console.log('Login bem-sucedido!');
    console.log('Usuário:', user.uid);
    
    return {
      success: true,
      message: 'Login bem-sucedido',
      userId: user.uid
    };
  } catch (error) {
    console.error('Erro ao fazer login da geradora:', error.message);
    
    return {
      success: false,
      message: `Erro: ${error.message}`,
      error: error
    };
  }
}

// Função para testar o login do cliente
async function testClienteLogin(email, senha) {
  try {
    console.log(`\nTestando login do cliente com email: ${email}`);
    
    // Tentar fazer login com o Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    console.log('Login bem-sucedido!');
    console.log('Usuário:', user.uid);
    
    return {
      success: true,
      message: 'Login bem-sucedido',
      userId: user.uid
    };
  } catch (error) {
    console.error('Erro ao fazer login do cliente:', error.message);
    
    return {
      success: false,
      message: `Erro: ${error.message}`,
      error: error
    };
  }
}

// Função para criar um cliente de teste
async function createTestCliente() {
  try {
    console.log('\nCriando cliente de teste...');
    
    const email = `cliente.teste.${Date.now()}@renovamais.com`;
    const senha = '!Teste102030';
    
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    console.log('Usuário criado no Firebase Auth:', user.uid);
    
    // Criar documento no Firestore
    const clienteData = {
      nome: 'Cliente de Teste',
      email: email,
      cpf: '12345678900',
      telefone: '84999999999',
      tipoCalculo: 'Percentual de Economia',
      percentualEconomia: 20,
      fonteTarifa: 'global',
      tusd: 0,
      te: 0,
      tipoIluminacao: 'percentual',
      valorIluminacaoFixo: 0,
      valorIluminacaoPercentual: 0,
      status: 'ativo',
      usina: 'Usina Solar 1',
      dataAdesao: new Date().toISOString(),
      dataCriacao: new Date().toISOString(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      role: 'client',
      isApproved: true
    };
    
    await setDoc(doc(db, 'clientes', user.uid), clienteData);
    
    console.log('Cliente criado no Firestore');
    console.log('Email:', email);
    console.log('Senha:', senha);
    
    return {
      id: user.uid,
      email: email,
      senha: senha,
      ...clienteData
    };
  } catch (error) {
    console.error('Erro ao criar cliente de teste:', error);
    return null;
  }
}

// Função principal
async function main() {
  try {
    console.log('Iniciando teste de acesso ao sistema...');
    console.log('Configuração do Firebase:', firebaseConfig);
    
    // Buscar geradoras
    const geradoras = await getGeradoras();
    
    // Buscar clientes
    const clientes = await getClientes();
    
    // Testar login da geradora
    if (geradoras.length > 0) {
      const geradora = geradoras[0];
      const senha = geradora.senha || '!Binho102030'; // Senha padrão ou a senha armazenada
      
      const loginResult = await testGeradoraLogin(geradora.email, senha);
      
      if (loginResult.success) {
        console.log('\nInstruções para acessar o portal da geradora:');
        console.log('1. Acesse http://192.168.1.133:8080/ no navegador');
        console.log(`2. Use o email: ${geradora.email}`);
        console.log(`3. Use a senha: ${senha}`);
        console.log('4. Clique em "Entrar"');
        console.log('5. Você será redirecionado para o portal da geradora');
      } else {
        console.log('\nNão foi possível fazer login como geradora. Verifique as credenciais.');
      }
    } else {
      console.log('\nNenhuma geradora encontrada para testar o login.');
    }
    
    // Testar login do cliente
    let cliente;
    if (clientes.length > 0) {
      cliente = clientes[0];
    } else {
      console.log('\nNenhum cliente encontrado. Criando um cliente de teste...');
      cliente = await createTestCliente();
    }
    
    if (cliente) {
      const senha = cliente.senha || '!Teste102030'; // Senha padrão ou a senha armazenada
      
      const loginResult = await testClienteLogin(cliente.email, senha);
      
      if (loginResult.success) {
        console.log('\nInstruções para acessar o portal do cliente:');
        console.log('1. Acesse http://192.168.1.133:8080/ no navegador');
        console.log(`2. Use o email: ${cliente.email}`);
        console.log(`3. Use a senha: ${senha}`);
        console.log('4. Clique em "Entrar"');
        console.log('5. Você será redirecionado para o portal do cliente');
      } else {
        console.log('\nNão foi possível fazer login como cliente. Verifique as credenciais.');
      }
    } else {
      console.log('\nNão foi possível criar ou encontrar um cliente para testar o login.');
    }
    
    console.log('\nTeste de acesso concluído!');
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
  }
}

// Executar a função principal
main();
