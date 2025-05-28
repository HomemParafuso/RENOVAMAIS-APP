import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvoiceProvider, useInvoice } from '../InvoiceContext';
import { describe, it, expect, vi } from 'vitest';

// Mock do componente que usa o contexto
const TestComponent = () => {
  const { invoices, addInvoice, removeInvoice } = useInvoice();
  return (
    <div>
      <button onClick={() => addInvoice({
        id: '1',
        number: 'FAT-001',
        amount: 100,
        dueDate: '2024-03-20',
        status: 'pending'
      })}>
        Adicionar Fatura
      </button>
      <div data-testid="invoices">
        {invoices.map((invoice) => (
          <div key={invoice.id}>
            <p>Fatura {invoice.number}</p>
            <p>Valor: R$ {invoice.amount}</p>
            <button onClick={() => removeInvoice(invoice.id)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('InvoiceContext', () => {
  it('deve renderizar o componente com o contexto', () => {
    render(
      <InvoiceProvider>
        <TestComponent />
      </InvoiceProvider>
    );
    
    expect(screen.getByText('Adicionar Fatura')).toBeInTheDocument();
  });

  it('deve adicionar uma fatura', async () => {
    render(
      <InvoiceProvider>
        <TestComponent />
      </InvoiceProvider>
    );

    const addButton = screen.getByText('Adicionar Fatura');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Fatura FAT-001')).toBeInTheDocument();
      expect(screen.getByText('Valor: R$ 100')).toBeInTheDocument();
    });
  });

  it('deve remover uma fatura', async () => {
    render(
      <InvoiceProvider>
        <TestComponent />
      </InvoiceProvider>
    );

    // Primeiro adiciona uma fatura
    const addButton = screen.getByText('Adicionar Fatura');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Fatura FAT-001')).toBeInTheDocument();
    });

    // Depois remove a fatura
    const removeButton = screen.getByText('Remover');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('Fatura FAT-001')).not.toBeInTheDocument();
    });
  });
}); 