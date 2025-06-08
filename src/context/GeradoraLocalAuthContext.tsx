import { createContext, useContext, useEffect, useState } from 'react';
import { useNotification } from './NotificationContext';

// Interface para usuário geradora local
export interface GeradoraLocal {
  id: string;
  email: string;
  nome: string;
  role: 'geradora';
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  cnpj?: string;
  responsavel?: string;
  telefone?: string;
  endereco?: string;
  status?: 'ativo' | 'bloqueado' | 'pendente';
  senha?: string; // Senha personalizada para a geradora
}

interface GeradoraLocalAuthContextType {
  geradora: GeradoraLocal | null;
  loading: boolean;
  loginGeradora: (email: string, password: string) => Promise<void>;
  logoutGeradora: () => Promise<void>;
}

const GeradoraLocalAuthContext = createContext<GeradoraLocalAuthContextType | undefined>(undefined);

export function GeradoraLocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [geradora, setGeradora] = useState<GeradoraLocal | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Verificar se há uma geradora logada no localStorage
    const checkAuth = async () => {
      const geradoraLogada = localStorage.getItem('geradora_logada');
      
      if (geradoraLogada) {
        try {
          const geradoraData = JSON.parse(geradoraLogada);
          setGeradora(geradoraData);
        } catch (error) {
          console.error('Erro ao carregar geradora do localStorage:', error);
          localStorage.removeItem('geradora_logada');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginGeradora = async (email: string, password: string) => {
    try {
      // Buscar geradoras do localStorage
      const geradorasSalvas = localStorage.getItem('geradoras');
      
      if (!geradorasSalvas) {
        throw new Error('Nenhuma geradora encontrada');
      }
      
      const geradoras = JSON.parse(geradorasSalvas);
      
      // Encontrar a geradora pelo email
      const geradoraEncontrada = geradoras.find((g: GeradoraLocal) => g.email === email);
      
      if (!geradoraEncontrada) {
        throw new Error('Geradora não encontrada');
      }
      
      // Verificar a senha (em um sistema real, isso seria feito com hash)
      // A geradora deve ter uma senha específica definida pelo admin
      if (!geradoraEncontrada.senha) {
        throw new Error('Geradora sem senha definida. Entre em contato com o administrador.');
      }
      
      console.log('Tentando login com senha:', password);
      
      if (password !== geradoraEncontrada.senha) {
        throw new Error('Senha incorreta');
      }
      
      // Verificar se a geradora está aprovada
      if (geradoraEncontrada.status === 'bloqueado') {
        throw new Error('Geradora bloqueada');
      }
      
      // Salvar a geradora no localStorage
      localStorage.setItem('geradora_logada', JSON.stringify(geradoraEncontrada));
      
      // Atualizar o estado
      setGeradora(geradoraEncontrada);
      
      addNotification({
        title: 'Login realizado com sucesso',
        message: `Bem-vindo(a), ${geradoraEncontrada.nome}!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao fazer login como geradora:', error);
      
      addNotification({
        title: 'Erro ao fazer login',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        type: 'error'
      });
      
      throw error;
    }
  };

  const logoutGeradora = async () => {
    try {
      // Remover a geradora do localStorage
      localStorage.removeItem('geradora_logada');
      
      // Atualizar o estado
      setGeradora(null);
      
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
    <GeradoraLocalAuthContext.Provider value={{ geradora, loading, loginGeradora, logoutGeradora }}>
      {children}
    </GeradoraLocalAuthContext.Provider>
  );
}

export function useGeradoraLocalAuth() {
  const context = useContext(GeradoraLocalAuthContext);
  if (context === undefined) {
    throw new Error('useGeradoraLocalAuth deve ser usado dentro de um GeradoraLocalAuthProvider');
  }
  return context;
}
