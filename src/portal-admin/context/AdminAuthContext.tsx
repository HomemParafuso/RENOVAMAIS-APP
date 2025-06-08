
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection,
  query,
  where,
  getDocs
} from '@/lib/firebase';

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verificar se o usuário é um administrador
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef, 
            where('email', '==', firebaseUser.email),
            where('role', '==', 'admin')
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Usuário é um administrador
            const adminUser: AdminUser = {
              email: firebaseUser.email || '',
              password: '',
              isAuthenticated: true
            };
            setUser(adminUser);
          } else {
            // Não é um administrador, fazer logout
            await signOut(auth);
            setUser(null);
          }
        } catch (error) {
          console.error('Erro ao verificar permissões de administrador:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });
    
    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função de login usando Firebase
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Autenticar com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        // Verificar se o usuário é um administrador
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef, 
          where('email', '==', email),
          where('role', '==', 'admin')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Se não for admin, fazer logout
          await signOut(auth);
          return false;
        }
        
        // Se for admin, salvar no estado (o useEffect já vai cuidar disso)
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout usando Firebase
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user?.isAuthenticated,
      loading
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
