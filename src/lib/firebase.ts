import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, onSnapshot, QueryConstraint, DocumentData, QueryDocumentSnapshot, Timestamp, WhereFilterOp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

// Inicializar Storage
export const storage = getStorage(app);

// Funções de Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
};

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
  clienteId?: string;
  amount: number; // Valor calculado
  valorTotalExtraido?: number; // Valor total lido do PDF
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  description?: string;
  reference?: string;
  leituraAnterior?: number;
  leituraAtual?: number;
  codigoConcessionaria?: string;
  dataStatus?: Date; // Nova data do status
  pdfUrl?: string; // Adicionando a propriedade pdfUrl
  tusd?: number;
  te?: number;
  valorIluminacao?: number;
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
    valorTotalExtraido: data.valorTotalExtraido || undefined,
    leituraAnterior: data.leituraAnterior || undefined,
    leituraAtual: data.leituraAtual || undefined,
    codigoConcessionaria: data.codigoConcessionaria || undefined,
    dataStatus: data.dataStatus ? fromFirestoreDate(data.dataStatus) : undefined,
    pdfUrl: data.pdfUrl || undefined,
    tusd: data.tusd || undefined,
    te: data.te || undefined,
    valorIluminacao: data.valorIluminacao || undefined,
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
  
  if (fatura.dataStatus) {
    data.dataStatus = toFirestoreDate(fatura.dataStatus);
  }
  
  if (fatura.pdfUrl) {
    data.pdfUrl = fatura.pdfUrl;
  }
  
  if (fatura.tusd) {
    data.tusd = fatura.tusd;
  }
  
  if (fatura.te) {
    data.te = fatura.te;
  }
  
  if (fatura.valorIluminacao) {
    data.valorIluminacao = fatura.valorIluminacao;
  }
  
  // Remover o ID, pois ele é usado como ID do documento
  delete data.id;
  
  return data;
};

export { collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, onSnapshot, Timestamp } from 'firebase/firestore';
export type { QueryConstraint, QueryDocumentSnapshot, WhereFilterOp, DocumentData } from 'firebase/firestore';
export type { User as FirebaseUser } from 'firebase/auth';
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'; 