export interface IPixIntegration {
  generatePixPayload(options: {
    nome: string; // Nome do recebedor
    chavepix: string; // Chave PIX
    valor: string; // Valor da transação
    cidade: string; // Cidade do recebedor
    txtId: string; // ID da transação (referência da fatura)
  }): string; // Retorna a payload PIX completa (BR Code)
  // Opcional: Adicionar métodos para gerar QR Code PNG/SVG se o banco tiver APIs específicas ou se for uma função utilitária.
} 