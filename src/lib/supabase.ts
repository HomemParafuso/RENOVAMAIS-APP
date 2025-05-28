import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type Tables = {
  users: {
    id: string;
    email: string;
    created_at: string;
    role: 'admin' | 'client' | 'generator';
  };
  invoices: {
    id: string;
    number: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid' | 'overdue';
    user_id: string;
    created_at: string;
  };
  notifications: {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    user_id: string;
    read: boolean;
    created_at: string;
  };
}; 