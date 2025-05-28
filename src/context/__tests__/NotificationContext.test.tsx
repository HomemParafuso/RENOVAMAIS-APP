import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../NotificationContext';
import { describe, it, expect, vi } from 'vitest';

// Mock do componente que usa o contexto
const TestComponent = () => {
  const { notifications, addNotification, removeNotification } = useNotification();
  return (
    <div>
      <button onClick={() => addNotification('Teste de notificação', 'info')}>
        Adicionar Notificação
      </button>
      <div data-testid="notifications">
        {notifications.map((notification) => (
          <div key={notification.id}>
            <p>{notification.message}</p>
            <button onClick={() => removeNotification(notification.id)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('NotificationContext', () => {
  it('deve renderizar o componente com o contexto', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    expect(screen.getByText('Adicionar Notificação')).toBeInTheDocument();
  });

  it('deve adicionar uma notificação', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addButton = screen.getByText('Adicionar Notificação');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Teste de notificação')).toBeInTheDocument();
    });
  });

  it('deve remover uma notificação', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Primeiro adiciona uma notificação
    const addButton = screen.getByText('Adicionar Notificação');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Teste de notificação')).toBeInTheDocument();
    });

    // Depois remove a notificação
    const removeButton = screen.getByText('Remover');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('Teste de notificação')).not.toBeInTheDocument();
    });
  });
}); 