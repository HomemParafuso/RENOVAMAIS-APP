import React from 'react';
import { render, screen } from '@testing-library/react';
import ClientePerfil from '../ClientePerfil';

describe('ClientePerfil', () => {
  it('renders the profile information correctly', () => {
    render(<ClientePerfil />);
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao.silva@email.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('01234-567')).toBeInTheDocument();
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('Usina Solar São Paulo I')).toBeInTheDocument();
    expect(screen.getByText('5 kWp')).toBeInTheDocument();
  });
}); 