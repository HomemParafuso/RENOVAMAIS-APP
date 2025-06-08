import { clienteService, ClienteApp } from './clienteService';

// Interface para os dados extraídos de uma fatura
export interface DadosFatura {
  cliente?: string;
  codigoConcessionaria?: string;
  referencia?: string;
  vencimento?: string;
  leituraAnterior?: number;
  leituraAtual?: number;
  valorTotal?: number;
}

// Interface para o resultado do cálculo de uma fatura
export interface ResultadoCalculo {
  valorTotal: number;
  valorDesconto: number;
  valorFinal: number;
  tipoCalculo: string;
  detalhes: {
    consumo: number;
    valorKwh: number;
    percentualEconomia?: number;
    valorFixo?: number;
    valorIluminacao?: number;
    percentualIluminacao?: number;
  };
}

/**
 * Serviço para processamento de faturas
 */
export const faturaService = {
  /**
   * Extrai dados de um arquivo PDF de fatura
   * @param file Arquivo PDF da fatura
   */
  async extrairDadosFatura(file: File): Promise<DadosFatura> {
    return new Promise((resolve) => {
      // Simulação de extração de dados do PDF
      // Em um sistema real, usaríamos uma biblioteca de OCR ou um serviço de extração de dados
      
      // Simulando um tempo de processamento
      setTimeout(() => {
        // Dados simulados que seriam extraídos do arquivo
        // Em um sistema real, esses dados viriam da análise do PDF
        const dadosExtraidos: DadosFatura = {
          codigoConcessionaria: "7025079684",
          referencia: "05/2025",
          vencimento: "2025-05-10",
          leituraAnterior: 9023,
          leituraAtual: 9788,
          valorTotal: 150.00 // Valor bruto da fatura
        };
        
        resolve(dadosExtraidos);
      }, 1500);
    });
  },
  
  /**
   * Busca o cliente associado ao código da concessionária
   * @param codigoConcessionaria Código da concessionária
   */
  async buscarClientePorCodigo(codigoConcessionaria: string): Promise<ClienteApp | null> {
    try {
      // Buscar todos os clientes
      const clientes = await clienteService.getAll();
      
      // Encontrar o cliente que possui o código da concessionária
      // Em um sistema real, teríamos uma relação direta entre cliente e códigos de concessionária
      // Aqui estamos simulando essa busca
      
      // Retornar o primeiro cliente encontrado (simulação)
      if (clientes.length > 0) {
        return clientes[0];
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente por código:', error);
      return null;
    }
  },
  
  /**
   * Calcula o valor da fatura com base nas configurações do cliente
   * @param dadosFatura Dados extraídos da fatura
   * @param cliente Cliente associado à fatura
   */
  calcularFatura(dadosFatura: DadosFatura, cliente: ClienteApp): ResultadoCalculo {
    // Verificar se temos os dados necessários
    if (!dadosFatura.leituraAnterior || !dadosFatura.leituraAtual) {
      throw new Error('Dados de leitura incompletos');
    }
    
    // Calcular o consumo em kWh
    const consumo = dadosFatura.leituraAtual - dadosFatura.leituraAnterior;
    
    // Definir o valor do kWh (em um sistema real, isso viria de uma configuração global ou específica do cliente)
    let valorKwh = 0.75; // Valor padrão
    
    // Se o cliente tem configuração de tarifa customizada
    if (cliente.fonteTarifa === 'custom') {
      // Somar TUSD e TE para obter o valor do kWh
      valorKwh = cliente.tusd + cliente.te;
    }
    
    // Calcular o valor total da fatura
    const valorTotal = consumo * valorKwh;
    
    // Calcular o desconto com base no tipo de cálculo do cliente
    let valorDesconto = 0;
    
    if (cliente.tipoCalculo === 'percentual') {
      // Desconto percentual sobre o valor total
      valorDesconto = valorTotal * (cliente.percentualEconomia / 100);
    } else if (cliente.tipoCalculo === 'nominal' || cliente.tipoCalculo === 'fixo') {
      // Valor fixo de desconto
      valorDesconto = cliente.percentualEconomia; // Neste caso, percentualEconomia é usado como valor fixo
    }
    
    // Calcular valor da iluminação pública (se aplicável)
    let valorIluminacao = 0;
    
    if (cliente.tipoIluminacao === 'fixo') {
      valorIluminacao = cliente.valorIluminacaoFixo;
    } else if (cliente.tipoIluminacao === 'percentual') {
      valorIluminacao = valorTotal * (cliente.valorIluminacaoPercentual / 100);
    }
    
    // Calcular o valor final (valor total - desconto)
    const valorFinal = valorTotal - valorDesconto;
    
    // Retornar o resultado do cálculo
    return {
      valorTotal,
      valorDesconto,
      valorFinal,
      tipoCalculo: cliente.tipoCalculo,
      detalhes: {
        consumo,
        valorKwh,
        percentualEconomia: cliente.tipoCalculo === 'percentual' ? cliente.percentualEconomia : undefined,
        valorFixo: cliente.tipoCalculo === 'nominal' || cliente.tipoCalculo === 'fixo' ? cliente.percentualEconomia : undefined,
        valorIluminacao,
        percentualIluminacao: cliente.tipoIluminacao === 'percentual' ? cliente.valorIluminacaoPercentual : undefined
      }
    };
  },
  
  /**
   * Processa uma fatura a partir de um arquivo
   * @param file Arquivo PDF da fatura
   */
  async processarFatura(file: File): Promise<{dadosFatura: DadosFatura, cliente: ClienteApp | null, resultado: ResultadoCalculo | null}> {
    try {
      // Extrair dados da fatura
      const dadosFatura = await this.extrairDadosFatura(file);
      
      // Buscar cliente associado ao código da concessionária
      const cliente = dadosFatura.codigoConcessionaria 
        ? await this.buscarClientePorCodigo(dadosFatura.codigoConcessionaria)
        : null;
      
      // Se não encontrou o cliente, retornar apenas os dados extraídos
      if (!cliente) {
        return { dadosFatura, cliente: null, resultado: null };
      }
      
      // Calcular a fatura com base nas configurações do cliente
      const resultado = this.calcularFatura(dadosFatura, cliente);
      
      return { dadosFatura, cliente, resultado };
    } catch (error) {
      console.error('Erro ao processar fatura:', error);
      throw error;
    }
  }
};
