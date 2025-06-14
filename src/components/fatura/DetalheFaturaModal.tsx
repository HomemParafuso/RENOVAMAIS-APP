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
import QRCode from 'qrcode';
import { IPixIntegration } from '@/integrations/pix/IPixIntegration';
import { sicrediPix } from '@/integrations/pix/sicrediPix';
import { sicoobPix } from '@/integrations/pix/sicoobPix';
import { Fatura } from "@/lib/firebase";

// Mapeia os códigos de banco para as implementações de integração PIX
const pixIntegrations: { [key: string]: IPixIntegration } = {
  '748': sicrediPix, // Sicredi
  '756': sicoobPix,  // Sicoob
  // Adicione outros bancos aqui conforme forem implementados
};

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
            // Assegura que o valor da fatura é um número formatado corretamente para o PIX
            const valorFormatado = (fatura.amount || 0).toFixed(2);

            const pixPayload = integration.generatePixPayload({
              nome: "RENOVVA MAIS", // Substituir pelo nome da empresa ou dinâmico se necessário
              chavepix: chave,
              valor: valorFormatado,
              cidade: "SAO PAULO", // Considerar tornar isso configurável no futuro
              txtId: fatura.reference || fatura.id,
            });
            setCodigoPixCopiaECola(pixPayload);

            // Gerar QR Code a partir da payload
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

          } else {
            console.warn(`Integração PIX para o banco ${banco} não encontrada.`);
            setCodigoPixCopiaECola("Erro: Banco não suportado para PIX.");
            setQrCodeDataUrl("");
          }
        } catch (error) {
          console.error("Erro ao parsear pixConfig do localStorage:", error);
          toast({
            title: "Erro de Configuração PIX",
            description: "Não foi possível carregar as configurações do PIX.",
            variant: "destructive",
          });
          setCodigoPixCopiaECola("Erro: Configuração PIX inválida.");
          setQrCodeDataUrl("");
        }
      } else {
        setCodigoPixCopiaECola("Configuração PIX não encontrada. Configure o PIX nas Configurações.");
        setQrCodeDataUrl("");
      }
    } else {
      setCodigoPixCopiaECola("");
      setQrCodeDataUrl("");
    }
  }, [fatura, toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codigoPixCopiaECola).then(() => {
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
                  <p className="text-base">{fatura.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referência</p>
                  <p className="text-base">{fatura.reference || "-"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vencimento</p>
                  <p className="text-base">{fatura.dueDate?.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor</p>
                  <p className="text-base font-semibold">{fatura.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fatura.status === "paid" ? "bg-green-100 text-green-800" :
                    fatura.status === "overdue" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {fatura.status === 'paid' ? 'Pago' : fatura.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Resumo do cálculo</p>
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
