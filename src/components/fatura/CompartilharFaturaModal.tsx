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
import { FileText, QrCode, Copy, Check, Download, Share2, MessageSquare, Mail, Send } from "lucide-react";
import QRCode from 'qrcode';
import { IPixIntegration } from '@/integrations/pix/IPixIntegration';
import { sicrediPix } from '@/integrations/pix/sicrediPix';
import { sicoobPix } from '@/integrations/pix/sicoobPix';
import { Fatura } from "@/lib/firebase";

const pixIntegrations: { [key: string]: IPixIntegration } = {
  '748': sicrediPix,
  '756': sicoobPix,
};

const CompartilharFaturaModal = ({ 
  isOpen, 
  onClose, 
  fatura 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  fatura?: Fatura;
}) => {
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [codigoPixCopiaECola, setCodigoPixCopiaECola] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (fatura) {
      const pixConfigStr = localStorage.getItem('pixConfig');
      if (pixConfigStr) {
        try {
          const pixConfig = JSON.parse(pixConfigStr);
          const { banco, tipoChave, chave } = pixConfig;

          const integration = pixIntegrations[banco];

          if (integration) {
            const valorFormatado = (fatura.amount || 0).toFixed(2);

            const pixPayload = integration.generatePixPayload({
              nome: "RENOVVA MAIS",
              chavepix: chave,
              valor: valorFormatado,
              cidade: "SAO PAULO",
              txtId: fatura.reference || fatura.id,
            });
            setCodigoPixCopiaECola(pixPayload);

            QRCode.toDataURL(pixPayload, { errorCorrectionLevel: 'H', width: 256 }, (err, url) => {
              if (err) {
                console.error("Erro ao gerar QR Code:", err);
                toast({
                  title: "Erro",
                  description: "Não foi possível gerar o QR Code.",
                  variant: "destructive",
                });
                setQrCodeDataUrl("");
              } else {
                setQrCodeDataUrl(url || "");
              }
            });
          }
        } catch (error) {
          console.error("Erro ao processar configuração PIX:", error);
          setQrCodeDataUrl("");
        }
      }
    }
  }, [fatura, toast]);

  const handleDownloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `qrcode-fatura-${fatura?.reference || fatura?.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    // Implementar lógica de notificação no sistema
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
                <p className="text-sm font-medium text-gray-700 mb-2">Resumo da Fatura</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cliente</span>
                    <span className="text-sm">{fatura.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Referência</span>
                    <span className="text-sm">{fatura.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor</span>
                    <span className="text-sm font-medium">{fatura.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vencimento</span>
                    <span className="text-sm">{fatura.dueDate?.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-4">QR Code PIX</p>
                <div className="flex flex-col items-center space-y-4">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="QR Code PIX" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-center">
                      Não foi possível gerar o QR Code.
                    </div>
                  )}
                  
                  <div className="w-full">
                    <p className="text-xs text-gray-500 mb-1">Código PIX Copia e Cola</p>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex-grow p-2 text-xs font-mono overflow-auto whitespace-normal break-all max-h-20">
                        {codigoPixCopiaECola}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(codigoPixCopiaECola);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 bg-gray-100 border-l border-gray-200 hover:bg-gray-200 flex-shrink-0"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleDownloadQRCode} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Salvar QR Code
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

export default CompartilharFaturaModal; 