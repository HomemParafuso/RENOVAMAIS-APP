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

interface MonitoramentoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonitoramentoConfigModal = ({ isOpen, onClose }: MonitoramentoConfigModalProps) => {
  const { toast } = useToast();
  const [plataforma, setPlataforma] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [intervalo, setIntervalo] = useState("60");

  // Carregar configurações existentes ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const loadMonitoramentoConfig = async () => {
        try {
          // Tentar carregar do Firebase primeiro
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const configDocRef = doc(db, 'configuracoes', userId);
            const docSnap = await getDoc(configDocRef);
            
            if (docSnap.exists() && docSnap.data().monitoramentoConfig) {
              const config = docSnap.data().monitoramentoConfig;
              setPlataforma(config.plataforma || "");
              setApiKey(config.apiKey || "");
              setIntervalo(config.intervalo || "60");
              return;
            }
          }
          
          // Fallback para localStorage
          const savedConfig = localStorage.getItem('monitoramentoConfig');
          if (savedConfig) {
            const config = JSON.parse(savedConfig);
            setPlataforma(config.plataforma || "");
            setApiKey(config.apiKey || "");
            setIntervalo(config.intervalo || "60");
          }
        } catch (error) {
          console.error("Erro ao carregar configuração de Monitoramento:", error);
        }
      };
      
      loadMonitoramentoConfig();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!plataforma || !apiKey) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const monitoramentoConfig = { plataforma, apiKey, intervalo };
    
    // Salvar no localStorage como fallback
    localStorage.setItem('monitoramentoConfig', JSON.stringify(monitoramentoConfig));
    
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
            monitoramentoConfig,
            updatedAt: new Date()
          });
        } else {
          // Criar novo documento
          await setDoc(configDocRef, {
            monitoramentoConfig,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        toast({
          title: "Configuração de Monitoramento salva",
          description: "As configurações de Monitoramento foram salvas com sucesso no servidor!",
        });
      } catch (error) {
        console.error("Erro ao salvar configuração de Monitoramento no Firebase:", error);
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
          <DialogTitle>Configuração de Monitoramento</DialogTitle>
          <DialogDescription>
            Configure a integração com o sistema de monitoramento solar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plataforma">Plataforma de Monitoramento</Label>
            <Select value={plataforma} onValueChange={setPlataforma}>
              <SelectTrigger id="plataforma">
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="growatt">Growatt</SelectItem>
                <SelectItem value="fronius">Fronius</SelectItem>
                <SelectItem value="solarEdge">SolarEdge</SelectItem>
                <SelectItem value="huawei">Huawei</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key / Token</Label>
            <Input 
              id="apiKey" 
              placeholder="Digite a chave da API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intervalo">Intervalo de Sincronização (minutos)</Label>
            <Select value={intervalo} onValueChange={setIntervalo}>
              <SelectTrigger id="intervalo">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="360">6 horas</SelectItem>
                <SelectItem value="720">12 horas</SelectItem>
                <SelectItem value="1440">24 horas</SelectItem>
              </SelectContent>
            </Select>
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

export default MonitoramentoConfigModal;
