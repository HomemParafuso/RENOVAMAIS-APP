
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

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

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O download da fatura foi iniciado.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
                    <span className="text-sm">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Desconto ({fatura.cliente ? "10%" : "0%"})</span>
                    <span className="text-sm">- R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Iluminação pública</span>
                    <span className="text-sm">R$ 0,00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="text-sm font-medium">Valor total</span>
                    <span className="text-sm font-medium">{fatura.valor}</span>
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
          <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
            Download da Fatura
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalheFaturaModal;
