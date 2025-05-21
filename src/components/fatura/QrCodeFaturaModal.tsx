
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { QrCode as QrCodeIcon, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Fatura {
  id: number;
  cliente: string;
  referencia: string;
  valor: string;
}

const QrCodeFaturaModal = ({ 
  isOpen, 
  onClose, 
  fatura 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  fatura?: Fatura;
}) => {
  const { toast } = useToast();
  const [codigoChave, setCodigoChave] = useState("FAT-1234-5678-90AB-CDEF");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Aqui poderia gerar uma chave aleatória baseada na fatura
    if (fatura) {
      const chaveAleatoria = `FAT-${fatura.id}-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).slice(2, 6)}`;
      setCodigoChave(chaveAleatoria.toUpperCase());
    }
  }, [fatura]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codigoChave).then(() => {
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>QR Code da Fatura</DialogTitle>
        </DialogHeader>
        
        {fatura ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="border border-gray-200 p-4 rounded-lg bg-white">
              <div className="w-48 h-48 flex items-center justify-center bg-gray-50">
                <QrCodeIcon className="w-32 h-32 text-gray-800" />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Referência: {fatura.referencia}</p>
              <p className="text-sm text-gray-600">Cliente: {fatura.cliente}</p>
              <p className="text-sm text-gray-600">Valor: {fatura.valor}</p>
            </div>
            
            <div className="w-full">
              <p className="text-xs text-gray-500 mb-1">Código para Compartilhamento</p>
              <div className="flex bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex-grow p-2 text-sm font-mono overflow-auto whitespace-normal break-all max-h-20">
                  {codigoChave}
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
        ) : (
          <p>Nenhuma informação disponível para esta fatura.</p>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeFaturaModal;
