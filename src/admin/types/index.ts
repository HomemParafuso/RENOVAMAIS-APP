
export interface Geradora {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  endereco: string;
  status: 'ativo' | 'bloqueado' | 'pendente';
  planoCobranca: PlanoCobranca;
  limiteUsuarios: number;
  usuariosAtivos: number;
  dataCadastro: string;
  ultimoPagamento?: string;
}

export interface PlanoCobranca {
  tipo: 'percentual' | 'fixo' | 'por_usuario' | 'misto';
  percentual?: number;
  valorFixo?: number;
  valorPorUsuario?: number;
  limitePorUsuario?: number;
  valorAcimaLimite?: number;
  salarioMinimoReferencia?: number;
}

export interface Imovel {
  id: number;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  consumoMedio: number;
  potenciaInstalada: number;
  dataInstalacao: string;
  status: 'ativo' | 'inativo';
  geradoraId: number;
  geradoraNome: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  geradoraId: number;
  geradoraNome: string;
  status: 'ativo' | 'bloqueado' | 'pendente';
  dataCadastro: string;
  consumoMedio: number;
  imoveis: Imovel[];
}

export interface AdminUser {
  email: string;
  password: string;
  isAuthenticated: boolean;
}
