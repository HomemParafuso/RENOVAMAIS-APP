import { render, screen, fireEvent } from '@testing-library/react';
import { InvoiceList } from '../InvoiceList';
import { InvoiceProvider } from '@/context/InvoiceContext';
import { NotificationProvider } from '@/context/NotificationContext';

const mockInvoices = [
  {
    id: '1',
    number: 'INV-001',
    amount: 100,
    due_date: '2024-03-20',
    status: 'pending',
    created_at: '2024-03-20T00:00:00Z',
    user_id: 'user1',
  },
  {
    id: '2',
    number: 'INV-002',
    amount: 200,
    due_date: '2024-03-21',
    status: 'paid',
    created_at: '2024-03-20T00:00:00Z',
    user_id: 'user1',
  },
];

describe('InvoiceList', () => {
  const renderComponent = (invoices = mockInvoices, loading = false) => {
    return render(
      <NotificationProvider>
        <InvoiceProvider>
          <InvoiceList invoices={invoices} loading={loading} />
        </InvoiceProvider>
      </NotificationProvider>
    );
  };

  it('deve renderizar a lista de faturas', () => {
    renderComponent();
    
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('INV-002')).toBeInTheDocument();
    expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 200.00')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de carregamento', () => {
    renderComponent([], true);
    expect(screen.getByText('Carregando faturas...')).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando não há faturas', () => {
    renderComponent([]);
    expect(screen.getByText('Nenhuma fatura encontrada.')).toBeInTheDocument();
  });

  it('deve mostrar status corretos das faturas', () => {
    renderComponent();
    
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Pago')).toBeInTheDocument();
  });

  it('deve ter botões de ação para cada fatura', () => {
    renderComponent();
    
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons).toHaveLength(mockInvoices.length * 2); // 2 botões por fatura
  });
}); 