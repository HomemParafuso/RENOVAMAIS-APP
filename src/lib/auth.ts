import { 
  auth, 
  db,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  FirebaseUser,
  userFromFirestore,
  userToFirestore
} from './firebase';

// Função para login
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Fazer login no Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Buscar dados adicionais do usuário no Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Se o usuário não existir no Firestore, criar um registro básico
      const now = new Date();
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'client',
        isApproved: false,
        createdAt: now,
        updatedAt: now
      };
      
      // Converter para formato do Firestore
      const userData = userToFirestore(newUser);
      
      // Salvar no Firestore
      await setDoc(userDocRef, userData);
      
      return newUser;
    }
    
    // Converter documento do Firestore para objeto User
    const user = userFromFirestore(userDoc);
    
    // Verificar se o usuário está aprovado
    if (!user.isApproved) {
      throw new Error('Usuário não aprovado');
    }
    
    // Atualizar último login
    await updateDoc(userDocRef, {
      lastLogin: new Date(),
      updatedAt: new Date()
    });
    
    return user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Função para registro
export const register = async (
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'client' | 'geradora' = 'client'
): Promise<User | null> => {
  try {
    // Criar usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Atualizar o perfil com o nome
    await updateProfile(firebaseUser, { displayName: name });
    
    // Criar registro do usuário no Firestore
    const now = new Date();
    const newUser: User = {
      id: firebaseUser.uid,
      email,
      name,
      role,
      isApproved: role === 'client', // Clientes são aprovados automaticamente
      createdAt: now,
      updatedAt: now
    };
    
    // Converter para formato do Firestore
    const userData = userToFirestore(newUser);
    
    // Salvar no Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, userData);
    
    return newUser;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

// Função para obter usuário pelo ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userFromFirestore(userDoc);
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
};

// Função para atualizar usuário
export const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
  try {
    // Adicionar timestamp de atualização
    const userWithTimestamp = {
      ...userData,
      updatedAt: new Date()
    };
    
    // Converter para formato do Firestore
    const firestoreData = userToFirestore(userWithTimestamp);
    
    // Atualizar no Firestore
    const userDocRef = doc(db, 'users', id);
    await updateDoc(userDocRef, firestoreData);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Exportar funções e tipos do Firebase
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};

export type { User };
