
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Geradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  status: string;
  clientesVinculados: number;
}

const DetalhesGeradoraModal = ({ 
  isOpen, 
  onClose, 
  geradora 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  geradora?: Geradora;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Geradora</DialogTitle>
        </DialogHeader>
        
        {geradora ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{geradora.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Potência</p>
                <p className="text-base">{geradora.potencia}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Localização</p>
                <p className="text-base">{geradora.localizacao}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {geradora.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Clientes Vinculados</p>
              <p className="text-base">{geradora.clientesVinculados}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Localização no Mapa</p>
              <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                {/* Aqui seria implementado o mapa interativo */}
                <p className="text-gray-500">Mapa interativo será implementado em breve</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Nenhuma informação disponível para esta geradora.</p>
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

export default DetalhesGeradoraModal;
