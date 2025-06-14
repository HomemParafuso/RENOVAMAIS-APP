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
import { FileText, Download, Share2, MessageSquare, Mail, Send } from "lucide-react";
import { Fatura } from "@/lib/firebase";

const CompartilharFaturaPDFModal = ({ 
  isOpen, 
  onClose, 
  fatura 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  fatura?: Fatura;
}) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    if (fatura?.pdfUrl) {
      window.open(fatura.pdfUrl, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "PDF da fatura não disponível.",
        variant: "destructive",
      });
    }
  };

  const handleCompartilharWhatsApp = () => {
    const mensagem = `Fatura ${fatura?.reference}\nValor: ${fatura?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nVencimento: ${fatura?.dueDate?.toLocaleDateString('pt-BR')}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleCompartilharEmail = (tipo: 'gmail' | 'outlook') => {
    const assunto = `Fatura ${fatura?.reference}`;
    const mensagem = `Fatura ${fatura?.reference}\nValor: ${fatura?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nVencimento: ${fatura?.dueDate?.toLocaleDateString('pt-BR')}`;
    const url = tipo === 'gmail' 
      ? `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`
      : `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleCompartilharTelegram = () => {
    const mensagem = `Fatura ${fatura?.reference}\nValor: ${fatura?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nVencimento: ${fatura?.dueDate?.toLocaleDateString('pt-BR')}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleNotificarCliente = () => {
    toast({
      title: "Notificação enviada",
      description: "O cliente será notificado sobre a nova fatura.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compartilhar Fatura</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {fatura ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Resumo do Cálculo</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor base (TU+TE)</span>
                    <span className="text-sm">{fatura.valorTotalExtraido?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Desconto</span>
                    <span className="text-sm text-green-600">- {((fatura.valorTotalExtraido || 0) - (fatura.amount || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Consumo</span>
                    <span className="text-sm">{((fatura.leituraAtual || 0) - (fatura.leituraAnterior || 0)).toLocaleString('pt-BR')} kWh</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="text-sm font-medium">Valor total</span>
                    <span className="text-sm font-medium">{fatura.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleDownloadPDF} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button variant="outline" onClick={handleNotificarCliente} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Notificar Cliente
                </Button>
                <Button variant="outline" onClick={handleCompartilharWhatsApp} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={() => handleCompartilharEmail('gmail')} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Gmail
                </Button>
                <Button variant="outline" onClick={() => handleCompartilharEmail('outlook')} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Outlook
                </Button>
                <Button variant="outline" onClick={handleCompartilharTelegram} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Telegram
                </Button>
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

export default CompartilharFaturaPDFModal; 