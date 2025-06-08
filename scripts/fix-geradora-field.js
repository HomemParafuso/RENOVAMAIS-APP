// Script para corrigir o campo "geradora" para "nome" no documento da geradora
// Execute este script com Node.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
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

// ID do documento da geradora que você criou
const geradoraId = '3CW0KdVx9pvRmDmiYzBZ';

// Função para corrigir o campo
async function fixGeradoraField() {
  try {
    console.log(`Corrigindo o campo "geradora" para "nome" no documento ${geradoraId}...`);
    
    // Obter o documento atual
    const geradoraRef = doc(db, 'geradoras', geradoraId);
    const geradoraSnap = await getDoc(geradoraRef);
    
    if (!geradoraSnap.exists()) {
      console.log(`Documento com ID ${geradoraId} não encontrado.`);
      return;
    }
    
    const geradoraData = geradoraSnap.data();
    console.log('Dados atuais da geradora:', geradoraData);
    
    // Verificar se o campo "geradora" existe
    if ('geradora' in geradoraData) {
      // Atualizar o documento: adicionar campo "nome" com o valor de "geradora"
      await updateDoc(geradoraRef, {
        nome: geradoraData.geradora
      });
      
      console.log(`Campo "nome" adicionado com o valor "${geradoraData.geradora}".`);
      
      // Opcionalmente, você pode remover o campo "geradora" se desejar
      // Isso requer uma segunda operação de atualização
      await updateDoc(geradoraRef, {
        geradora: null // Isso não remove o campo, apenas define como null
      });
      
      console.log('Campo "geradora" definido como null.');
      
      console.log('Correção concluída com sucesso!');
    } else {
      console.log('O campo "geradora" não foi encontrado no documento.');
      
      // Se o campo "geradora" não existir, mas você quiser adicionar o campo "nome" de qualquer forma
      if (!('nome' in geradoraData)) {
        await updateDoc(geradoraRef, {
          nome: "Geradora Exemplo"
        });
        
        console.log('Campo "nome" adicionado com o valor "Geradora Exemplo".');
      } else {
        console.log(`O campo "nome" já existe com o valor "${geradoraData.nome}".`);
      }
    }
    
  } catch (error) {
    console.error('Erro ao corrigir o campo:', error);
  }
}

// Executar a função
fixGeradoraField();
