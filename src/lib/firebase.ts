import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, onSnapshot, QueryConstraint, DocumentData, QueryDocumentSnapshot, Timestamp, WhereFilterOp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';

// Verificar se as variáveis de ambiente estão sendo carregadas corretamente
console.log("Variáveis de ambiente do Firebase:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase config:", firebaseConfig);

// Inicializar o Firebase
let app;
try {
  // Verificar se já existe uma instância do Firebase
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error; // Re-throw para garantir que a aplicação não continue com Firebase não inicializado
}

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Authentication
export const auth = getAuth(app);

// Tipos
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'geradora';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fatura {
  id?: string;
  userId: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  description?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: { field: string; operator: WhereFilterOp; value: unknown }[];
}

// Funções auxiliares para converter entre formatos de data
export const toFirestoreDate = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

export const fromFirestoreDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Funções para converter documentos do Firestore para objetos TypeScript
export const userFromFirestore = (doc: DocumentData): User => {
  const data = doc.data();
  return {
    id: doc.id,
    email: data.email,
    name: data.name,
    role: data.role,
    isApproved: data.isApproved,
    createdAt: fromFirestoreDate(data.createdAt),
    updatedAt: fromFirestoreDate(data.updatedAt)
  };
};

export const faturaFromFirestore = (doc: DocumentData): Fatura => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    amount: data.amount,
    dueDate: fromFirestoreDate(data.dueDate),
    status: data.status,
    description: data.description,
    reference: data.reference,
    createdAt: fromFirestoreDate(data.createdAt),
    updatedAt: fromFirestoreDate(data.updatedAt)
  };
};

// Funções para converter objetos TypeScript para documentos do Firestore
export const userToFirestore = (user: Partial<User>) => {
  const data: Record<string, unknown> = { ...user };
  
  if (user.createdAt) {
    data.createdAt = toFirestoreDate(user.createdAt);
  }
  
  if (user.updatedAt) {
    data.updatedAt = toFirestoreDate(user.updatedAt);
  }
  
  // Remover o ID, pois ele é usado como ID do documento
  delete data.id;
  
  return data;
};

export const faturaToFirestore = (fatura: Partial<Fatura>) => {
  const data: Record<string, unknown> = { ...fatura };
  
  if (fatura.dueDate) {
    data.dueDate = toFirestoreDate(fatura.dueDate);
  }
  
  if (fatura.createdAt) {
    data.createdAt = toFirestoreDate(fatura.createdAt);
  }
  
  if (fatura.updatedAt) {
    data.updatedAt = toFirestoreDate(fatura.updatedAt);
  }
  
  // Remover o ID, pois ele é usado como ID do documento
  delete data.id;
  
  return data;
};

// Exportar funções e objetos úteis do Firebase
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};

export type { FirebaseUser, QueryConstraint, QueryDocumentSnapshot, WhereFilterOp };
