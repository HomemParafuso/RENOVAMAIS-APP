import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type Invoice = Tables['invoices'];

interface InvoiceContextType {
  invoices: Invoice[];
  loading: boolean;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => Promise<void>;
  removeInvoice: (id: string) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();

    // Inscrever-se para mudanças em tempo real
    const subscription = supabase
      .channel('invoices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInvoices((prev) => [...prev, payload.new as Invoice]);
          } else if (payload.eventType === 'UPDATE') {
            setInvoices((prev) =>
              prev.map((invoice) =>
                invoice.id === payload.new.id ? (payload.new as Invoice) : invoice
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setInvoices((prev) =>
              prev.filter((invoice) => invoice.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase.from('invoices').insert([invoice]);
    if (error) throw error;
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  };

  const removeInvoice = async (id: string) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, loading, addInvoice, updateInvoiceStatus, removeInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice deve ser usado dentro de um InvoiceProvider');
  }
  return context;
} 