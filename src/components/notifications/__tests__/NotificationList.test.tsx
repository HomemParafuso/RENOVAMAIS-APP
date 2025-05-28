import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationList } from '../NotificationList';
import { NotificationProvider } from '@/context/NotificationContext';

const mockNotifications = [
  {
    id: '1',
    message: 'Nova fatura criada',
    type: 'success',
    read: false,
    created_at: '2024-03-20T00:00:00Z',
    user_id: 'user1',
  },
  {
    id: '2',
    message: 'Fatura vencida',
    type: 'error',
    read: true,
    created_at: '2024-03-20T00:00:00Z',
    user_id: 'user1',
  },
];

describe('NotificationList', () => {
  const renderComponent = () => {
    return render(
      <NotificationProvider>
        <NotificationList />
      </NotificationProvider>
    );
  };

  it('deve renderizar a lista de notificações', () => {
    renderComponent();
    
    expect(screen.getByText('Nova fatura criada')).toBeInTheDocument();
    expect(screen.getByText('Fatura vencida')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de carregamento', () => {
    renderComponent();
    expect(screen.getByText('Carregando notificações...')).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando não há notificações', () => {
    renderComponent();
    expect(screen.getByText('Nenhuma notificação encontrada.')).toBeInTheDocument();
  });

  it('deve ter botões de ação para notificações não lidas', () => {
    renderComponent();
    
    const markAsReadButtons = screen.getAllByText('Marcar como lida');
    expect(markAsReadButtons).toHaveLength(1); // Apenas para notificações não lidas
  });

  it('deve ter botões de remover para todas as notificações', () => {
    renderComponent();
    
    const removeButtons = screen.getAllByText('Remover');
    expect(removeButtons).toHaveLength(mockNotifications.length);
  });
}); 