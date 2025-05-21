
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { FileText, QrCode, Copy, Check } from "lucide-react";

interface Fatura {
  id: number;
  cliente: string;
  referencia: string;
  vencimento: string;
  valor: string;
  status: string;
}

const DetalheFaturaModal = ({ 
  isOpen, 
  onClose, 
  fatura 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  fatura?: Fatura;
}) => {
  const { toast } = useToast();
  const [codigoPix, setCodigoPix] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (fatura) {
      // Gerar um código PIX aleatório baseado na fatura
      const codePix = `00020126580014BR.GOV.BCB.PIX01369${fatura.id}${Date.now().toString().substring(0, 4)}@${Math.random().toString(36).substring(2, 7)}5204000053039865802BR5924RENOVA MAIS ENERGIA LTDA6009SAO PAULO62090505${fatura.id}${Math.random().toString(36).substring(2, 6)}6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setCodigoPix(codePix);
    }
  }, [fatura]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codigoPix).then(() => {
      setCopied(true);
      toast({
        title: "Código copiado",
        description: "O código foi copiado para a área de transferência."
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Fatura</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {fatura ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-base">{fatura.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-base">{fatura.referencia || "-"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-base">{fatura.vencimento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-base font-semibold">{fatura.valor}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fatura.status === "Pago" ? "bg-green-100 text-green-800" :
                    fatura.status === "Atrasado" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {fatura.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Resumo do cálculo</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor base (TU+TE)</span>
                    <span className="text-sm">R$ 180,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Desconto (10%)</span>
                    <span className="text-sm text-green-600">- R$ 18,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Iluminação pública</span>
                    <span className="text-sm">R$ 8,00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="text-sm font-medium">Valor total</span>
                    <span className="text-sm font-medium">{fatura.valor}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">QR Code para Pagamento</p>
                  <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
                      <QrCode className="w-32 h-32 text-gray-800" />
                    </div>
                    
                    <div className="w-full">
                      <p className="text-xs text-gray-500 mb-1">Código PIX Copia e Cola</p>
                      <div className="flex bg-gray-50 border border-gray-200 rounded-md">
                        <div className="flex-grow p-2 text-xs font-mono overflow-auto whitespace-normal break-all max-h-20">
                          {codigoPix}
                        </div>
                        <button 
                          onClick={copyToClipboard} 
                          className="p-2 bg-gray-100 border-l border-gray-200 hover:bg-gray-200 flex-shrink-0"
                        >
                          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Nenhuma informação disponível para esta fatura.</p>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalheFaturaModal;
