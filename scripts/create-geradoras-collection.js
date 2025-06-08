// Script para criar a coleção "geradoras" no Firebase e adicionar uma geradora de exemplo
// Execute este script com Node.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
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
const db = getFirestore(app);

// Função para verificar se a coleção "geradoras" existe
async function checkGeradorasCollection() {
  try {
    console.log('Verificando se a coleção "geradoras" existe...');
    
    const geradorasCollection = collection(db, 'geradoras');
    const geradorasSnapshot = await getDocs(geradorasCollection);
    
    if (geradorasSnapshot.empty) {
      console.log('A coleção "geradoras" existe, mas está vazia.');
      return true;
    } else {
      console.log(`A coleção "geradoras" existe e contém ${geradorasSnapshot.size} documentos.`);
      console.log('Geradoras encontradas:');
      
      geradorasSnapshot.forEach((doc) => {
        const geradora = doc.data();
        console.log(`- ${geradora.nome} (ID: ${doc.id})`);
      });
      
      return true;
    }
  } catch (error) {
    // Se ocorrer um erro, pode ser porque a coleção não existe
    console.log('A coleção "geradoras" não existe ou ocorreu um erro ao acessá-la.');
    console.error('Erro:', error);
    return false;
  }
}

// Função para criar a coleção "geradoras" e adicionar uma geradora de exemplo
async function createGeradorasCollection() {
  try {
    console.log('Criando a coleção "geradoras" e adicionando uma geradora de exemplo...');
    
    // Criar um documento na coleção "geradoras"
    const geradoraRef = doc(collection(db, 'geradoras'), 'geradora-exemplo');
    
    // Dados da geradora de exemplo
    const geradoraData = {
      nome: "Geradora Exemplo",
      email: "exemplo@renovamais.com",
      responsavel: "Administrador",
      telefone: "84999999999",
      cnpj: "12345678901234",
      status: "ativo",
      dataCadastro: new Date().toISOString(),
      limiteUsuarios: 50,
      usuariosAtivos: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Adicionar a geradora de exemplo
    await setDoc(geradoraRef, geradoraData);
    
    console.log('Geradora de exemplo adicionada com sucesso!');
    console.log('ID da geradora:', geradoraRef.id);
    console.log('Dados da geradora:', geradoraData);
    
    return true;
  } catch (error) {
    console.error('Erro ao criar a coleção "geradoras":', error);
    return false;
  }
}

// Função principal
async function main() {
  try {
    console.log('Conectando ao Firebase...');
    console.log('Configuração do Firebase:', firebaseConfig);
    
    // Verificar se a coleção "geradoras" existe
    const collectionExists = await checkGeradorasCollection();
    
    if (!collectionExists) {
      // Se a coleção não existir, criar
      const created = await createGeradorasCollection();
      
      if (created) {
        console.log('A coleção "geradoras" foi criada com sucesso!');
      } else {
        console.log('Não foi possível criar a coleção "geradoras".');
      }
    } else {
      console.log('A coleção "geradoras" já existe. Não é necessário criá-la.');
    }
  } catch (error) {
    console.error('Erro ao executar o script:', error);
  }
}

// Executar a função principal
main();
