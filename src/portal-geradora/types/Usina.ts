export interface Usina {
  id: string;
  nome: string;
  endereco: string;
  geradoraId: string; // ID da geradora à qual esta usina pertence
  producaoMensalKWh: number;
  status: 'ativo' | 'inativo' | 'em_manutencao';
  createdAt: Date;
  updatedAt: Date;
} 