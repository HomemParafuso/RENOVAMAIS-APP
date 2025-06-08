import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DetalhesUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora?: UsinaGeradora;
}

const DetalhesUsinaModal = ({ isOpen, onClose, geradora }: DetalhesUsinaModalProps) => {
  if (!geradora) return null;

  // Função para formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return "Não informada";
    try {
      const data = new Date(dataString);
      return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dataString;
    }
  };

  // Função para formatar status
  const formatarStatus = (status?: string) => {
    if (!status) return "Não definido";
    
    switch (status.toLowerCase()) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      case "manutencao":
        return "Em Manutenção";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Usina Geradora</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-semibold">{geradora.nome}</h3>
              <p className="text-muted-foreground">{geradora.descricao || "Sem descrição"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Potência Instalada</h4>
              <p>{geradora.potencia}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                geradora.status === 'ativo' ? 'bg-green-100 text-green-800' : 
                geradora.status === 'inativo' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {formatarStatus(geradora.status)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Localização</h4>
              <p>{geradora.localizacao}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Endereço</h4>
              <p>{geradora.endereco}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">CNPJ</h4>
              <p>{geradora.cnpj}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Código de Consumidor</h4>
              <p>{geradora.codigoConsumidor}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email de Acesso</h4>
              <p>{geradora.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Clientes Vinculados</h4>
              <p>{geradora.clientesVinculados || 0}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Data de Instalação</h4>
              <p>{formatarData(geradora.dataInstalacao)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Data de Cadastro</h4>
              <p>{formatarData(geradora.dataCadastro)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Marca do Inversor</h4>
              <p>{geradora.marcaInversor || "Não informado"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Chave da API</h4>
              <p>{geradora.apiKey ? "Configurada" : "Não configurada"}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button>Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesUsinaModal;
