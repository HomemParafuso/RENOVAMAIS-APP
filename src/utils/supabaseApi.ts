import { supabase } from './supabaseConfig';

export const addFatura = async (fatura: any) => {
  const { data, error } = await supabase
    .from('faturas')
    .insert([fatura]);

  if (error) {
    console.error('Erro ao adicionar fatura:', error);
    throw error;
  }

  return data;
}; 