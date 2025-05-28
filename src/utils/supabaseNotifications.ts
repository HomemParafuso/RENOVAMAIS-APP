import { supabase } from './supabaseConfig';

export const subscribeToFaturaNotifications = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('faturas')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'faturas' }, callback)
    .subscribe();

  return subscription;
}; 