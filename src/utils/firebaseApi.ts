import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Fatura,
  User,
  QueryOptions,
  userFromFirestore,
  faturaFromFirestore,
  userToFirestore,
  faturaToFirestore,
  QueryDocumentSnapshot,
  WhereFilterOp
} from '@/lib/firebase';

// Constantes para coleções
const USERS_COLLECTION = 'users';
const FATURAS_COLLECTION = 'faturas';

// Cache para usuários
const userCache = new Map<string, User>();

// Função para adicionar fatura
export const addFatura = async (fatura: Omit<Fatura, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fatura> => {
  try {
    // Adicionar timestamps
    const now = new Date();
    const faturaWithTimestamps: Fatura = {
      ...fatura,
      createdAt: now,
      updatedAt: now
    };
    
    // Converter para formato do Firestore
    const firestoreData = faturaToFirestore(faturaWithTimestamps);
    
    // Referência para um novo documento com ID gerado automaticamente
    const newFaturaRef = doc(collection(db, FATURAS_COLLECTION));
    
    // Salvar no Firestore
    await setDoc(newFaturaRef, firestoreData);
    
    // Retornar a fatura com o ID gerado
    return {
      ...faturaWithTimestamps,
      id: newFaturaRef.id
    };
  } catch (error) {
    console.error('Erro ao adicionar fatura:', error);
    throw error;
  }
};

// Função para buscar faturas com paginação
export const getFaturas = async (options: QueryOptions = {}): Promise<{
  data: Fatura[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    lastDoc: QueryDocumentSnapshot | null;
  };
}> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderByField = 'createdAt',
      orderDirection = 'desc',
      filters = []
    } = options;

    // Construir a consulta base
    const queryConstraints = [];
    
    // Adicionar filtros
    for (const filter of filters) {
      queryConstraints.push(where(filter.field, filter.operator, filter.value));
    }
    
    // Adicionar ordenação
    queryConstraints.push(orderBy(orderByField, orderDirection));
    
    // Adicionar limite
    queryConstraints.push(limit(pageSize));
    
    // Criar a consulta
    const q = query(collection(db, FATURAS_COLLECTION), ...queryConstraints);
    
    // Executar a consulta
    const querySnapshot = await getDocs(q);
    
    // Converter documentos para objetos Fatura
    const faturas = querySnapshot.docs.map(doc => faturaFromFirestore(doc));
    
    // Buscar informações dos usuários para cada fatura
    const faturasWithUserInfo = await Promise.all(
      faturas.map(async (fatura) => {
        const user = await getUserById(fatura.userId);
        return {
          ...fatura,
          user: user ? { name: user.name, email: user.email } : undefined
        };
      })
    );
    
    // Obter o total de documentos (isso é uma simplificação, em produção você pode querer usar uma abordagem mais eficiente)
    const totalQuery = query(collection(db, FATURAS_COLLECTION));
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;
    
    return {
      data: faturasWithUserInfo as Fatura[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      }
    };
  } catch (error) {
    console.error('Erro ao buscar faturas:', error);
    throw error;
  }
};

// Função para buscar fatura por ID
export const getFaturaById = async (id: string): Promise<Fatura | null> => {
  try {
    const docRef = doc(db, FATURAS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const fatura = faturaFromFirestore(docSnap);
    
    // Buscar informações do usuário
    const user = await getUserById(fatura.userId);
    
    return {
      ...fatura,
      user: user ? { name: user.name, email: user.email } : undefined
    } as Fatura;
  } catch (error) {
    console.error('Erro ao buscar fatura por ID:', error);
    throw error;
  }
};

// Função para atualizar fatura
export const updateFatura = async (id: string, fatura: Partial<Fatura>): Promise<boolean> => {
  try {
    // Adicionar timestamp de atualização
    const faturaWithTimestamp = {
      ...fatura,
      updatedAt: new Date()
    };
    
    // Converter para formato do Firestore
    const firestoreData = faturaToFirestore(faturaWithTimestamp);
    
    // Atualizar no Firestore
    const docRef = doc(db, FATURAS_COLLECTION, id);
    await updateDoc(docRef, firestoreData);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar fatura:', error);
    throw error;
  }
};

// Função para excluir fatura
export const deleteFatura = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, FATURAS_COLLECTION, id);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir fatura:', error);
    throw error;
  }
};

// Função para buscar usuário por ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    // Verificar cache primeiro
    if (userCache.has(id)) {
      return userCache.get(id) || null;
    }
    
    // Se não estiver em cache, buscar do Firestore
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const user = userFromFirestore(docSnap);
    
    // Armazenar em cache
    userCache.set(id, user);
    
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

// Função para limpar o cache de usuários
export const clearUserCache = (): void => {
  userCache.clear();
};

// Função para buscar usuários com paginação
export const getUsers = async (options: QueryOptions = {}): Promise<{
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    lastDoc: QueryDocumentSnapshot | null;
  };
}> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderByField = 'createdAt',
      orderDirection = 'desc',
      filters = []
    } = options;

    // Construir a consulta base
    const queryConstraints = [];
    
    // Adicionar filtros
    for (const filter of filters) {
      queryConstraints.push(where(filter.field, filter.operator, filter.value));
    }
    
    // Adicionar ordenação
    queryConstraints.push(orderBy(orderByField, orderDirection));
    
    // Adicionar limite
    queryConstraints.push(limit(pageSize));
    
    // Criar a consulta
    const q = query(collection(db, USERS_COLLECTION), ...queryConstraints);
    
    // Executar a consulta
    const querySnapshot = await getDocs(q);
    
    // Converter documentos para objetos User
    const users = querySnapshot.docs.map(doc => userFromFirestore(doc));
    
    // Obter o total de documentos
    const totalQuery = query(collection(db, USERS_COLLECTION));
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;
    
    return {
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      }
    };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para adicionar usuário
export const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    // Adicionar timestamps
    const now = new Date();
    const userWithTimestamps: User = {
      ...user,
      id: '', // Será substituído pelo ID gerado
      createdAt: now,
      updatedAt: now
    };
    
    // Converter para formato do Firestore
    const firestoreData = userToFirestore(userWithTimestamps);
    
    // Referência para um novo documento com ID gerado automaticamente
    const newUserRef = doc(collection(db, USERS_COLLECTION));
    
    // Salvar no Firestore
    await setDoc(newUserRef, firestoreData);
    
    // Retornar o usuário com o ID gerado
    const createdUser = {
      ...userWithTimestamps,
      id: newUserRef.id
    };
    
    // Armazenar em cache
    userCache.set(createdUser.id, createdUser);
    
    return createdUser;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
};

// Função para atualizar usuário
export const updateUser = async (id: string, user: Partial<User>): Promise<boolean> => {
  try {
    // Adicionar timestamp de atualização
    const userWithTimestamp = {
      ...user,
      updatedAt: new Date()
    };
    
    // Converter para formato do Firestore
    const firestoreData = userToFirestore(userWithTimestamp);
    
    // Atualizar no Firestore
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, firestoreData);
    
    // Limpar cache para este usuário
    userCache.delete(id);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Função para excluir usuário
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id);
    await deleteDoc(docRef);
    
    // Limpar cache para este usuário
    userCache.delete(id);
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};
