
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, CreditCard, Banknote } from "lucide-react";

const ClientePagamentos = () => {
  const historicosPagamentos = [
    { 
      id: 1, 
      data: '10/05/2025', 
      fatura: 'Abril/2025', 
      valor: 'R$ 160,00', 
      metodo: 'PIX', 
      status: 'Confirmado',
      comprovante: 'COMP_2025_04.pdf'
    },
    { 
      id: 2, 
      data: '12/04/2025', 
      fatura: 'Março/2025', 
      valor: 'R$ 180,00', 
      metodo: 'Cartão de Crédito', 
      status: 'Confirmado',
      comprovante: 'COMP_2025_03.pdf'
    },
    { 
      id: 3, 
      data: '08/03/2025', 
      fatura: 'Fevereiro/2025', 
      valor: 'R$ 155,00', 
      metodo: 'PIX', 
      status: 'Confirmado',
      comprovante: 'COMP_2025_02.pdf'
    },
  ];

  const faturasPendentes = [
    { 
      id: 1, 
      fatura: 'Maio/2025', 
      valor: 'R$ 170,00', 
      vencimento: '15/06/2025',
      diasRestantes: 8
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie seus pagamentos e histórico financeiro</p>
        </div>
      </div>

      {/* Faturas Pendentes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-yellow-500" />
            Faturas Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faturasPendentes.length > 0 ? (
            <div className="space-y-4">
              {faturasPendentes.map((fatura) => (
                <div key={fatura.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{fatura.fatura}</h4>
                    <p className="text-sm text-gray-600">Vencimento: {fatura.vencimento}</p>
                    <p className="text-sm text-yellow-600 font-medium">
                      {fatura.diasRestantes} dias restantes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{fatura.valor}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Banknote className="h-4 w-4 mr-2" />
                        Pagar com PIX
                      </Button>
                      <Button size="sm" variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Todas as faturas estão em dia!</h3>
              <p className="text-gray-500">Você não possui faturas pendentes no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historicosPagamentos.map((pagamento) => (
              <div key={pagamento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-4">
                    {pagamento.metodo === 'PIX' ? (
                      <Banknote className="h-4 w-4 text-green-600" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{pagamento.fatura}</h4>
                    <p className="text-sm text-gray-600">Pago em {pagamento.data}</p>
                    <p className="text-sm text-gray-500">via {pagamento.metodo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{pagamento.valor}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {pagamento.status}
                  </span>
                  <div className="mt-2">
                    <Button size="sm" variant="outline">
                      Baixar Comprovante
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Total Pago em 2025</h3>
            <p className="text-3xl font-bold text-green-600">R$ 1.695</p>
            <p className="text-sm text-gray-500 mt-2">5 faturas pagas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Economia Acumulada</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 1.420</p>
            <p className="text-sm text-gray-500 mt-2">vs tarifa convencional</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Próximo Vencimento</h3>
            <p className="text-3xl font-bold text-yellow-600">8 dias</p>
            <p className="text-sm text-gray-500 mt-2">15/06/2025</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientePagamentos;
