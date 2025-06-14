import { clienteService, ClienteApp } from './clienteService';
import * as pdfjsLib from 'pdfjs-dist';

// Configuração global para o worker do PDF.js
// Em produção, considere servir este arquivo localmente (ex: copiá-lo para a pasta 'public')
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// Interface para os dados extraídos de uma fatura
export interface DadosFatura {
  cliente?: string;
  codigoConcessionaria?: string;
  referencia?: string;
  vencimento?: string;
  leituraAnterior?: number;
  leituraAtual?: number;
  valorTotal?: number;
  pdfUrl?: string;
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
    fonteTarifa?: string;
    tusd?: number;
    te?: number;
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
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';

          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            // Filtra apenas TextItem (que possui a propriedade 'str')
            fullText += textContent.items.filter(item => 'str' in item).map(item => (item as any).str).join(' ') + '\n';
          }

          // Criar um Blob do ArrayBuffer para gerar uma URL de objeto
          const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Extrair dados do texto completo
          const dadosExtraidos: DadosFatura = this.parseTextForFaturaData(fullText);
          dadosExtraidos.pdfUrl = pdfUrl; // Adicionar a URL do PDF aos dados extraídos

          resolve(dadosExtraidos);

        } catch (error) {
          console.error("Erro ao extrair dados do PDF:", error);
          reject(new Error("Não foi possível extrair dados do PDF."));
        }
      };
      reader.onerror = (error) => {
        reject(new Error("Erro ao ler o arquivo: " + error));
      };
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * Função auxiliar para analisar o texto do PDF e extrair os dados da fatura.
   * Esta é uma implementação básica e pode precisar de refinamentos para diferentes layouts de fatura.
   * @param text Texto completo extraído do PDF.
   */
  parseTextForFaturaData(text: string): DadosFatura {
    const dados: DadosFatura = {};

    // Extrair código do cliente - baseado no exemplo Python
    const codigoConcessionariaMatch = text.match(/CÓDIGO DO CLIENTE\s*(\d+)/i);
    if (codigoConcessionariaMatch && codigoConcessionariaMatch[1]) {
      dados.codigoConcessionaria = codigoConcessionariaMatch[1];
    }

    // Extrair referência (mês/ano) - baseado no exemplo Python
    const referenciaMatch = text.match(/REF:MÊS\/ANO\s*(\d{2}\/\d{4})/i);
    if (referenciaMatch && referenciaMatch[1]) {
      dados.referencia = referenciaMatch[1];
    }

    // Extrair leituras (anterior e atual) - baseado no padrão Neoenergia do exemplo Python
    const leiturasMatch = text.match(/Energia Ativa\s+Único\s+(\d+\.?\d*,\d+)\s+(\d+\.?\d*,\d+)/i);
    if (leiturasMatch && leiturasMatch[1] && leiturasMatch[2]) {
      // Tratar a vírgula como separador decimal e remover pontos de milhar
      const leituraAnteriorStr = leiturasMatch[1].replace(/\./g, '').replace(',', '.');
      const leituraAtualStr = leiturasMatch[2].replace(/\./g, '').replace(',', '.');
      dados.leituraAnterior = parseInt(leituraAnteriorStr); // Usando parseInt, pois a leitura parece ser um número inteiro
      dados.leituraAtual = parseInt(leituraAtualStr);
    }

    // Exemplo de extração: Vencimento (mantido do original, pode precisar de ajuste)
    const vencimentoMatch = text.match(/(?:Vencimento|Data de Vencimento):?\s*(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/i);
    if (vencimentoMatch && vencimentoMatch[1]) {
      dados.vencimento = vencimentoMatch[1];
    }

    // Exemplo de extração: Valor Total (mantido do original, pode precisar de ajuste)
    const valorTotalMatch = text.match(/(?:Valor Total|Total a Pagar|Valor a Pagar):?\s*[R$]?\s*(\d+\,\d{2})/i);
    if (valorTotalMatch && valorTotalMatch[1]) {
      dados.valorTotal = parseFloat(valorTotalMatch[1].replace(',', '.'));
    }

    // Nota: A extração de 'cliente' e 'endereço' a partir de texto livre é mais complexa e
    // geralmente requer soluções de NLP ou OCR mais avançadas.
    // Por enquanto, o 'cliente' será preenchido pelo sistema através do 'buscarClientePorCodigo'.

    return dados;
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
    
    // Calcular o valor base da fatura (consumo * valorKwh)
    const valorBase = consumo * valorKwh;
    
    // Calcular o valor da iluminação pública
    let valorIluminacao = 0;
    
    if (cliente.tipoIluminacao === 'fixo') {
      valorIluminacao = cliente.valorIluminacaoFixo || 0;
    } else if (cliente.tipoIluminacao === 'percentual') {
      valorIluminacao = valorBase * ((cliente.valorIluminacaoPercentual || 0) / 100);
    }
    
    // O valor total na concessionária é o valor base + iluminação pública
    const valorTotalConcessionaria = valorBase + valorIluminacao;
    
    // Calcular o desconto com base no tipo de cálculo do cliente
    let valorDesconto = 0;
    
    if (cliente.tipoCalculo === 'percentual') {
      // Desconto percentual sobre o valor total na concessionária
      valorDesconto = valorTotalConcessionaria * ((cliente.percentualEconomia || 0) / 100);
    } else if (cliente.tipoCalculo === 'nominal' || cliente.tipoCalculo === 'fixo') {
      // Valor fixo de desconto (percentualEconomia é usado como valor fixo neste caso)
      valorDesconto = cliente.percentualEconomia || 0;
    }
    
    // Calcular o valor final (valor total na concessionária - desconto)
    const valorFinal = valorTotalConcessionaria - valorDesconto;
    
    // Retornar o resultado do cálculo
    return {
      valorTotal: valorTotalConcessionaria,
      valorDesconto,
      valorFinal,
      tipoCalculo: cliente.tipoCalculo,
      detalhes: {
        consumo,
        valorKwh,
        percentualEconomia: cliente.tipoCalculo === 'percentual' ? cliente.percentualEconomia : undefined,
        valorFixo: cliente.tipoCalculo === 'nominal' || cliente.tipoCalculo === 'fixo' ? cliente.percentualEconomia : undefined,
        valorIluminacao, // Valor monetário da iluminação pública
        percentualIluminacao: cliente.tipoIluminacao === 'percentual' ? cliente.valorIluminacaoPercentual : undefined,
        fonteTarifa: cliente.fonteTarifa,
        tusd: cliente.tusd,
        te: cliente.te
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
  },

  /**
   * Helper function to format date string for input type="date" (YYYY-MM-DD).
   * Converts DD/MM/YYYY to YYYY-MM-DD.
   * @param dateString Date string in DD/MM/YYYY or YYYY-MM-DD format.
   * @returns Formatted date string in YYYY-MM-DD or original if invalid.
   */
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    // If already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    // If DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString; // Return as is if format is unexpected
  },
};
