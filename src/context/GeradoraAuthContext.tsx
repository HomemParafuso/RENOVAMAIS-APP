import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection,
  query,
  where,
  getDocs,
  User as FirebaseUser
} from '@/lib/firebase';

// Interface para usuário geradora
export interface Geradora {
  id: string;
  email: string;
  nome: string;
  role: 'geradora';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  cnpj?: string;
  responsavel?: string;
  telefone?: string;
  endereco?: string;
  status?: 'ativo' | 'bloqueado' | 'pendente';
}

interface GeradoraAuthContextType {
  geradora: Geradora | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginGeradora: (email: string, password: string) => Promise<void>;
  logoutGeradora: () => Promise<void>;
}

const GeradoraAuthContext = createContext<GeradoraAuthContextType | undefined>(undefined);

export function GeradoraAuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [geradora, setGeradora] = useState<Geradora | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          // Verificar se o usuário é uma geradora
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef, 
            where('email', '==', fbUser.email),
            where('role', '==', 'geradora')
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Usuário é uma geradora
            const geradoraDoc = querySnapshot.docs[0];
            const geradoraData = geradoraDoc.data();
            
            const geradoraUser: Geradora = {
              id: geradoraDoc.id,
              email: geradoraData.email,
              nome: geradoraData.nome || geradoraData.name,
              role: 'geradora',
              isApproved: geradoraData.isApproved,
              createdAt: geradoraData.createdAt.toDate(),
              updatedAt: geradoraData.updatedAt.toDate(),
              cnpj: geradoraData.cnpj,
              responsavel: geradoraData.responsavel,
              telefone: geradoraData.telefone,
              endereco: geradoraData.endereco,
              status: geradoraData.status
            };
            
            setGeradora(geradoraUser);
          } else {
            // Não é uma geradora, fazer logout
            await signOut(auth);
            setGeradora(null);
          }
        } catch (error) {
          console.error('Erro ao verificar permissões de geradora:', error);
          setGeradora(null);
        }
      } else {
        setGeradora(null);
      }
      
      setLoading(false);
    });
    
    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const loginGeradora = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Verificar localStorage para login local
      try {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradora = geradoras.find((g: { email: string; senha?: string; nome: string; id: string }) => 
            g.email === email && 
            (g.senha === password || !g.senha) // Verificar senha se existir
          );
          
          if (geradora) {
            console.log('Login local bem-sucedido para geradora:', geradora.nome);
            
            // Criar objeto de geradora a partir dos dados locais
            const geradoraUser: Geradora = {
              id: geradora.id,
              email: geradora.email,
              nome: geradora.nome,
              role: 'geradora',
              isApproved: geradora.isApproved || true,
              createdAt: new Date(geradora.dataCadastro || new Date()),
              updatedAt: new Date(),
              cnpj: geradora.cnpj,
              responsavel: geradora.responsavel,
              telefone: geradora.telefone,
              endereco: geradora.endereco,
              status: geradora.status || 'ativo'
            };
            
            setGeradora(geradoraUser);
            
            addNotification({
              title: 'Login local realizado com sucesso',
              message: 'Bem-vindo(a) ao portal da geradora! (Modo local)',
              type: 'success'
            });
            
            return;
          }
        }
      } catch (localError) {
        console.error('Erro ao tentar login local:', localError);
      }
      
      // Se não conseguiu fazer login local, tentar com Firebase
      
      // Autenticar com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        // Verificar se o usuário é uma geradora
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef, 
          where('email', '==', email),
          where('role', '==', 'geradora')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Se não for geradora, fazer logout
          await signOut(auth);
          throw new Error('Usuário não é uma geradora');
        }
        
        // Se for geradora, o useEffect já vai cuidar de atualizar o estado
        addNotification({
          title: 'Login realizado com sucesso',
          message: 'Bem-vindo(a) ao portal da geradora!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login como geradora:', error);
      
      addNotification({
        title: 'Erro ao fazer login',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        type: 'error'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutGeradora = async () => {
    try {
      // Verificar se a geradora atual fez login pelo localStorage
      const isLocalGeradora = geradora && !firebaseUser;
      
      if (isLocalGeradora) {
        console.log('Fazendo logout de geradora local');
        // Para geradoras que fizeram login pelo localStorage, precisamos limpar o estado manualmente
        setGeradora(null);
      } else {
        // Para geradoras autenticadas pelo Firebase, usar signOut
        await signOut(auth);
        // O estado da geradora será atualizado pelo observador onAuthStateChanged
      }
      
      addNotification({
        title: 'Logout realizado com sucesso',
        message: 'Você saiu do sistema',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return (
    <GeradoraAuthContext.Provider value={{ 
      geradora, 
      firebaseUser, 
      loading, 
      loginGeradora, 
      logoutGeradora 
    }}>
      {children}
    </GeradoraAuthContext.Provider>
  );
}

export function useGeradoraAuth() {
  const context = useContext(GeradoraAuthContext);
  if (context === undefined) {
    throw new Error('useGeradoraAuth deve ser usado dentro de um GeradoraAuthProvider');
  }
  return context;
}
