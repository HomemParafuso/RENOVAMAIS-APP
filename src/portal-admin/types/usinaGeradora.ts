export interface UsinaGeradora {
  id: string;
  nome: string;
  potencia: string;
  localizacao: string;
  endereco: string;
  codigoConsumidor: string;
  email: string;
  senha: string;
  cnpj: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
  descricao?: string;
  dataInstalacao?: string;
  dataCadastro: string;
  geradoraId: string;
}
