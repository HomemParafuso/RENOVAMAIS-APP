import { supabase } from '@/lib/supabase';

// Interfaces melhoradas com tipos mais específicos
interface Fatura {
  user_id: string;
  amount: number;
  due_date: string;
  status?: 'pending' | 'paid' | 'overdue';
  description?: string;
  reference?: string;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'geradora';
  name: string;
  is_approved: boolean;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

interface QueryOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Função otimizada para adicionar fatura
export const addFatura = async (fatura: Fatura) => {
  try {
    const { data, error } = await supabase
      .from('faturas')
      .insert([fatura])
      .select(); // Retorna os dados inseridos

    if (error) {
      console.error('Erro ao adicionar fatura:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao adicionar fatura:', error);
    throw error;
  }
};

// Função otimizada para buscar faturas com paginação
export const getFaturas = async (options: QueryOptions = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderBy = 'created_at',
      orderDirection = 'desc'
    } = options;

    // Calcular o range para paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Consulta com paginação e ordenação
    const query = supabase
      .from('faturas')
      .select('*, user:user_id(name, email)', { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar faturas:', error);
      throw error;
    }

    return {
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0
      }
    };
  } catch (error) {
    console.error('Erro inesperado ao buscar faturas:', error);
    throw error;
  }
};

// Função para buscar usuário por ID com cache
const userCache = new Map<string, User>();

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    // Verificar cache primeiro
    if (userCache.has(userId)) {
      return userCache.get(userId) || null;
    }

    // Se não estiver em cache, buscar do banco
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Nenhum resultado
        return null;
      }
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }

    // Armazenar em cache
    if (data) {
      userCache.set(userId, data as User);
    }

    return data as User || null;
  } catch (error) {
    console.error('Erro inesperado ao buscar usuário:', error);
    throw error;
  }
};

// Função para limpar o cache de usuários
export const clearUserCache = () => {
  userCache.clear();
};
