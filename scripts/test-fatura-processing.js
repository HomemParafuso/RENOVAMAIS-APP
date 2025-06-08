/**
 * Script para testar o processamento de faturas
 * 
 * Este script simula o processamento de uma fatura a partir de um arquivo PDF
 * e exibe os resultados do cálculo com base nas configurações do cliente.
 */

// Importar o serviço de faturas
const { faturaService } = require('../src/services/faturaService');

// Simular um arquivo de fatura
const mockFile = {
  name: '005 LAIANY.pdf',
  type: 'application/pdf',
  size: 1024 * 1024 * 2, // 2MB
};

// Função para testar o processamento de faturas
async function testFaturaProcessing() {
  console.log('Iniciando teste de processamento de faturas...');
  console.log(`Arquivo: ${mockFile.name} (${mockFile.type}, ${mockFile.size / 1024 / 1024}MB)`);
  
  try {
    // Simular o processamento da fatura
    console.log('Extraindo dados da fatura...');
    const dadosFatura = await faturaService.extrairDadosFatura(mockFile);
    console.log('Dados extraídos:', JSON.stringify(dadosFatura, null, 2));
    
    // Simular a busca do cliente
    console.log('Buscando cliente associado...');
    const cliente = await faturaService.buscarClientePorCodigo(dadosFatura.codigoConcessionaria || '');
    
    if (!cliente) {
      console.log('Cliente não encontrado para o código da concessionária.');
      return;
    }
    
    console.log('Cliente encontrado:', JSON.stringify({
      id: cliente.id,
      nome: cliente.nome,
      tipoCalculo: cliente.tipoCalculo,
      percentualEconomia: cliente.percentualEconomia
    }, null, 2));
    
    // Calcular a fatura
    console.log('Calculando fatura...');
    const resultado = faturaService.calcularFatura(dadosFatura, cliente);
    
    console.log('Resultado do cálculo:');
    console.log(JSON.stringify(resultado, null, 2));
    
    console.log('Teste concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar o teste
testFaturaProcessing();
