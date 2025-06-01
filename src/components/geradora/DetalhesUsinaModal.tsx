import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UsinaGeradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  endereco?: string;
  cnpj?: string;
  status: string;
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
  descricao?: string;
  dataInstalacao?: string;
  dataCadastro?: string;
}

interface DetalhesUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: UsinaGeradora | undefined;
}

const DetalhesUsinaModal = ({ isOpen, onClose, geradora }: DetalhesUsinaModalProps) => {
  if (!geradora) return null;

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Não informada";
    try {
      const data = new Date(dataString);
      return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Usina Geradora</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a usina geradora.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">{geradora.nome}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    geradora.status === "ativo" ? "bg-green-100 text-green-800" : 
                    geradora.status === "inativo" ? "bg-red-100 text-red-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {geradora.status === "ativo" ? "Ativo" : 
                     geradora.status === "inativo" ? "Inativo" : 
                     "Em Manutenção"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clientes Vinculados</p>
                <p className="font-medium">{geradora.clientesVinculados}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dados Básicos</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">CNPJ</p>
                  <p className="font-medium">{geradora.cnpj || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="font-medium">{geradora.localizacao}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{geradora.endereco || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Cadastro</p>
                  <p className="font-medium">{formatarData(geradora.dataCadastro)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dados Técnicos</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Potência Instalada</p>
                  <p className="font-medium">{geradora.potencia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Instalação</p>
                  <p className="font-medium">{formatarData(geradora.dataInstalacao)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marca do Inversor</p>
                  <p className="font-medium">{geradora.marcaInversor || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chave da API</p>
                  <p className="font-medium">
                    {geradora.apiKey ? 
                      `${geradora.apiKey.substring(0, 4)}...${geradora.apiKey.substring(geradora.apiKey.length - 4)}` : 
                      "Não informada"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {geradora.descricao && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Descrição</h4>
              <p className="text-sm">{geradora.descricao}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesUsinaModal;
