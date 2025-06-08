import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PixConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PixConfigModal = ({ isOpen, onClose }: PixConfigModalProps) => {
  const { toast } = useToast();
  const [banco, setBanco] = useState("");
  const [tipoChave, setTipoChave] = useState("");
  const [chave, setChave] = useState("");

  const handleSave = () => {
    if (!banco || !tipoChave || !chave) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Save PIX configuration to localStorage
    const pixConfig = { banco, tipoChave, chave };
    localStorage.setItem('pixConfig', JSON.stringify(pixConfig));

    toast({
      title: "Configuração PIX salva",
      description: "As configurações do PIX foram salvas com sucesso!",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuração do PIX</DialogTitle>
          <DialogDescription>
            Configure suas informações para recebimento de pagamentos via PIX.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {tipoChave && tipoChave !== "CPF/CNPJ" && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Atenção: Apenas chaves do tipo CNPJ/CPF conseguirão se integrar completamente com o sistema do banco.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="banco">Banco</Label>
            <Select value={banco} onValueChange={setBanco}>
              <SelectTrigger id="banco">
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "001", label: "Banco do Brasil" },
                  { value: "104", label: "Caixa Econômica Federal" },
                  { value: "237", label: "Bradesco" },
                  { value: "341", label: "Itaú" },
                  { value: "077", label: "Inter" },
                  { value: "260", label: "Nubank" },
                  { value: "033", label: "Santander" },
                  { value: "748", label: "Sicredi" },
                  { value: "756", label: "Sicoob" },
                  { value: "655", label: "Votorantim" },
                  { value: "212", label: "Banco Original" },
                  { value: "336", label: "C6 Bank" },
                ]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoChave">Tipo de Chave PIX</Label>
            <Select value={tipoChave} onValueChange={setTipoChave}>
              <SelectTrigger id="tipoChave">
                <SelectValue placeholder="Selecione o tipo de chave" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPF/CNPJ">CPF/CNPJ</SelectItem>
                <SelectItem value="EMAIL">E-mail</SelectItem>
                <SelectItem value="TELEFONE">Telefone</SelectItem>
                <SelectItem value="ALEATORIA">Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chave">Chave PIX</Label>
            <Input 
              id="chave" 
              placeholder={
                tipoChave === "CPF/CNPJ" ? "Digite o CPF/CNPJ" :
                tipoChave === "EMAIL" ? "Digite o email" :
                tipoChave === "TELEFONE" ? "Digite o telefone" :
                tipoChave === "ALEATORIA" ? "Digite a chave aleatória" :
                "Digite a chave PIX"
              }
              value={chave}
              onChange={(e) => setChave(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PixConfigModal;
