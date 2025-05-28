import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { describe, it, expect, vi } from 'vitest';

// Mock do componente que usa o contexto
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <p>Usuário logado: {user.email}</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>Entrar</button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('deve renderizar o componente com o contexto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('deve fazer login com sucesso', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Usuário logado: test@example.com/)).toBeInTheDocument();
    });
  });

  it('deve fazer logout com sucesso', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Primeiro faz login
    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Usuário logado: test@example.com/)).toBeInTheDocument();
    });

    // Depois faz logout
    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText('Entrar')).toBeInTheDocument();
    });
  });
}); 