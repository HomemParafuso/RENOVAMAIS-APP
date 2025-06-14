import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { db, doc, getDoc, setDoc, updateDoc, auth } from "@/lib/firebase";

interface ContabilConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContabilConfigModal = ({ isOpen, onClose }: ContabilConfigModalProps) => {
  const { toast } = useToast();
  const [sistema, setSistema] = useState("");
  const [formato, setFormato] = useState("xml");
  const [endpoint, setEndpoint] = useState("");

  // Carregar configurações existentes ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const loadContabilConfig = async () => {
        try {
          // Tentar carregar do Firebase primeiro
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const configDocRef = doc(db, 'configuracoes', userId);
            const docSnap = await getDoc(configDocRef);
            
            if (docSnap.exists() && docSnap.data().contabilConfig) {
              const config = docSnap.data().contabilConfig;
              setSistema(config.sistema || "");
              setFormato(config.formato || "xml");
              setEndpoint(config.endpoint || "");
              return;
            }
          }
          
          // Fallback para localStorage
          const savedConfig = localStorage.getItem('contabilConfig');
          if (savedConfig) {
            const config = JSON.parse(savedConfig);
            setSistema(config.sistema || "");
            setFormato(config.formato || "xml");
            setEndpoint(config.endpoint || "");
          }
        } catch (error) {
          console.error("Erro ao carregar configuração de Exportação Contábil:", error);
        }
      };
      
      loadContabilConfig();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!sistema) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione o sistema contábil",
        variant: "destructive",
      });
      return;
    }

    const contabilConfig = { sistema, formato, endpoint };
    
    // Salvar no localStorage como fallback
    localStorage.setItem('contabilConfig', JSON.stringify(contabilConfig));
    
    // Salvar no Firebase se o usuário estiver autenticado
    if (auth.currentUser) {
      try {
        const userId = auth.currentUser.uid;
        const configDocRef = doc(db, 'configuracoes', userId);
        
        // Verificar se o documento já existe
        const docSnap = await getDoc(configDocRef);
        
        if (docSnap.exists()) {
          // Atualizar documento existente
          await updateDoc(configDocRef, {
            contabilConfig,
            updatedAt: new Date()
          });
        } else {
          // Criar novo documento
          await setDoc(configDocRef, {
            contabilConfig,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        toast({
          title: "Configuração de Exportação Contábil salva",
          description: "As configurações de Exportação Contábil foram salvas com sucesso no servidor!",
        });
      } catch (error) {
        console.error("Erro ao salvar configuração de Exportação Contábil no Firebase:", error);
        toast({
          title: "Configuração salva localmente",
          description: "As configurações foram salvas localmente, mas houve um erro ao salvar no servidor.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Configuração salva localmente",
        description: "As configurações foram salvas apenas localmente. Faça login para salvar no servidor.",
        variant: "destructive",
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuração de Exportação Contábil</DialogTitle>
          <DialogDescription>
            Configure a integração com o sistema contábil.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sistema">Sistema Contábil</Label>
            <Select value={sistema} onValueChange={setSistema}>
              <SelectTrigger id="sistema">
                <SelectValue placeholder="Selecione o sistema contábil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dominio">Domínio Sistemas</SelectItem>
                <SelectItem value="sage">Sage</SelectItem>
                <SelectItem value="totvs">TOTVS</SelectItem>
                <SelectItem value="sankhya">Sankhya</SelectItem>
                <SelectItem value="nfe">NFe.io</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="formato">Formato de Exportação</Label>
            <Select value={formato} onValueChange={setFormato}>
              <SelectTrigger id="formato">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint de Integração (opcional)</Label>
            <Input 
              id="endpoint" 
              placeholder="https://api.sistema-contabil.com/v1/import"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
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

export default ContabilConfigModal;
