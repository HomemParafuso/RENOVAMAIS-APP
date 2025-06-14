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

interface ApiPagamentosConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiPagamentosConfigModal = ({ isOpen, onClose }: ApiPagamentosConfigModalProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [modo, setModo] = useState("sandbox");

  // Carregar configurações existentes ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const loadApiConfig = async () => {
        try {
          // Tentar carregar do Firebase primeiro
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const configDocRef = doc(db, 'configuracoes', userId);
            const docSnap = await getDoc(configDocRef);
            
            if (docSnap.exists() && docSnap.data().apiConfig) {
              const config = docSnap.data().apiConfig;
              setApiKey(config.apiKey || "");
              setEndpoint(config.endpoint || "");
              setModo(config.modo || "sandbox");
              return;
            }
          }
          
          // Fallback para localStorage
          const savedConfig = localStorage.getItem('apiConfig');
          if (savedConfig) {
            const config = JSON.parse(savedConfig);
            setApiKey(config.apiKey || "");
            setEndpoint(config.endpoint || "");
            setModo(config.modo || "sandbox");
          }
        } catch (error) {
          console.error("Erro ao carregar configuração da API de Pagamentos:", error);
        }
      };
      
      loadApiConfig();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey || !endpoint) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const apiConfig = { apiKey, endpoint, modo };
    
    // Salvar no localStorage como fallback
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
    
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
            apiConfig,
            updatedAt: new Date()
          });
        } else {
          // Criar novo documento
          await setDoc(configDocRef, {
            apiConfig,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        toast({
          title: "Configuração da API salva",
          description: "As configurações da API de Pagamentos foram salvas com sucesso no servidor!",
        });
      } catch (error) {
        console.error("Erro ao salvar configuração da API no Firebase:", error);
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
          <DialogTitle>Configuração da API de Pagamentos</DialogTitle>
          <DialogDescription>
            Configure a integração com a API de processamento de pagamentos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              placeholder="Digite a chave da API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint da API</Label>
            <Input 
              id="endpoint" 
              placeholder="https://api.exemplo.com/v1"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modo">Modo de Operação</Label>
            <Select value={modo} onValueChange={setModo}>
              <SelectTrigger id="modo">
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                <SelectItem value="production">Produção</SelectItem>
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

export default ApiPagamentosConfigModal;
