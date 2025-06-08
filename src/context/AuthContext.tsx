import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db,
  doc,
  getDoc,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  FirebaseUser,
  User
} from '@/lib/firebase';
import { getUserById, addUser, updateUser } from '@/utils/firebaseApi';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Buscar informações adicionais do usuário no Firestore
          const userData = await getUserById(firebaseUser.uid);
          
          if (userData) {
            setUser(userData);
          } else {
            // Se não encontrar dados do usuário no Firestore, criar um registro básico
            const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: 'client',
              isApproved: false
            };
            
            await addUser(newUser);
            
            // Buscar novamente para obter o usuário completo
            const createdUser = await getUserById(firebaseUser.uid);
            setUser(createdUser);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Limpar o observador quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Verificação especial para o admin
      if (email === 'pabllo.tca@gmail.com' && password === 'admin123') {
        console.log('Login especial para o admin');
        
        // Buscar o usuário admin do Firestore diretamente
        try {
          const adminDocRef = doc(db, 'users', 'admin-user-123456');
          console.log('Buscando documento admin:', adminDocRef);
          
          const adminDocSnap = await getDoc(adminDocRef);
          console.log('Documento admin existe?', adminDocSnap.exists());
          
          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            console.log('Dados do admin:', adminData);
            
            const adminUser = {
              id: 'admin-user-123456',
              email: adminData.email,
              name: adminData.name,
              role: adminData.role,
              isApproved: adminData.isApproved,
              createdAt: adminData.createdAt.toDate(),
              updatedAt: adminData.updatedAt.toDate()
            };
            
            console.log('Usuário admin criado:', adminUser);
            setUser(adminUser);
            console.log('Estado do usuário atualizado para admin');
            return;
          } else {
            console.error('Documento admin não encontrado no Firestore');
          }
        } catch (adminError) {
          console.error('Erro ao buscar usuário admin:', adminError);
        }
      }
      
      // Verificar se é uma geradora no localStorage
      try {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradora = geradoras.find((g: { email: string; senha?: string }) => 
            g.email === email && 
            (g.senha === password || !g.senha) // Verificar senha se existir
          );
          
          if (geradora) {
            console.log('Login local bem-sucedido para geradora:', geradora.nome);
            
            // Criar objeto de usuário a partir dos dados da geradora
            const geradoraUser: User = {
              id: geradora.id,
              email: geradora.email,
              name: geradora.nome,
              role: 'geradora', // Tipo literal 'geradora' já é compatível com User['role']
              isApproved: geradora.isApproved || true,
              createdAt: new Date(geradora.dataCadastro || geradora.createdAt || new Date()),
              updatedAt: new Date()
            };
            
            console.log('Usuário geradora criado:', geradoraUser);
            setUser(geradoraUser);
            console.log('Estado do usuário atualizado para geradora');
            return;
          }
        }
      } catch (localError) {
        console.error('Erro ao tentar login local para geradora:', localError);
      }
      
      // Login normal para outros usuários
      await signInWithEmailAndPassword(auth, email, password);
      // O estado do usuário será atualizado pelo observador onAuthStateChanged
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Verificar se o usuário atual é uma geradora que fez login pelo localStorage
      const isLocalGeradora = user?.role === 'geradora' && !firebaseUser;
      
      if (isLocalGeradora) {
        console.log('Fazendo logout de geradora local');
        // Para geradoras que fizeram login pelo localStorage, precisamos limpar o estado manualmente
        setUser(null);
      } else {
        // Para usuários autenticados pelo Firebase, usar signOut
        await signOut(auth);
        // O estado do usuário será atualizado pelo observador onAuthStateChanged
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Atualizar o perfil com o nome
      await updateProfile(firebaseUser, { displayName: name });
      
      // Criar registro do usuário no Firestore
      const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email,
        name,
        role: 'client',
        isApproved: false
      };
      
      await addUser(newUser);
      
      // O estado do usuário será atualizado pelo observador onAuthStateChanged
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
