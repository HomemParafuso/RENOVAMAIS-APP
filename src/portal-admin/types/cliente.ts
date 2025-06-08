export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  status: 'ativo' | 'inativo' | 'pendente';
  geradoraId: string;
  usinaId: string | null;
  dataCadastro: string;
  dataAtualizacao?: string;
  observacoes?: string;
  consumoMedio?: number;
  valorMedio?: number;
  userId?: string;
}
