
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { supabase } from '@/lib/supabase';

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
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user } = session;
          
          // Verificar se o usuário é um administrador
          const { data: adminData, error: adminError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .eq('role', 'admin')
            .single();
            
          if (adminData && !adminError) {
            const adminUser: AdminUser = {
              email: user.email || '',
              password: '',
              isAuthenticated: true
            };
            setUser(adminUser);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Função de login usando Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Verificar se o usuário é um administrador
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('role', 'admin')
          .single();
          
        if (adminError || !adminData) {
          // Se não for admin, fazer logout
          await supabase.auth.signOut();
          return false;
        }
        
        // Se for admin, salvar no estado
        const adminUser: AdminUser = {
          email,
          password: '',
          isAuthenticated: true
        };
        
        setUser(adminUser);
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

  // Função de logout usando Supabase
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
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
