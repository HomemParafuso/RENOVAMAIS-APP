
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, UserPlus, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  tipoCalculo: string;
  status: string;
}

interface Geradora {
  id: number;
  nome: string;
}

const GerenciarClientesModal = ({ 
  isOpen, 
  onClose, 
  geradora 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  geradora?: Geradora;
}) => {
  const [filterText, setFilterText] = useState("");
  const { toast } = useToast();
  
  // Mock data - in a real application, this would be filtered based on the geradora
  const clientes: Cliente[] = [
    {
      id: 1,
      nome: "Pablio Tacyanno",
      cpf: "",
      tipoCalculo: "Percentual de Economia",
      status: "Ativo"
    }
  ];
  
  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(filterText.toLowerCase())
  );
  
  const handleDesvincular = (cliente: Cliente) => {
    toast({
      title: "Cliente desvinculado",
      description: `O cliente ${cliente.nome} foi desvinculado da geradora.`,
    });
  };
  
  const handleVerDetalhes = (cliente: Cliente) => {
    toast({
      title: "Ver detalhes",
      description: "Função de visualizar detalhes do cliente será implementada em breve.",
    });
  };
  
  const handleAdicionarClientes = () => {
    toast({
      title: "Vincular clientes",
      description: "Função de vincular novos clientes será implementada em breve.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {geradora ? `Clientes Vinculados a ${geradora.nome}` : "Clientes Vinculados"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar cliente"
              className="pl-10"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <Button onClick={handleAdicionarClientes} className="bg-green-600 hover:bg-green-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Vincular Clientes
          </Button>
        </div>
        
        {filteredClientes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Tipo de Cálculo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf || '-'}</TableCell>
                  <TableCell>{cliente.tipoCalculo}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {cliente.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleVerDetalhes(cliente)}>
                          <ChevronRight className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDesvincular(cliente)}>
                          <span className="text-red-500 flex items-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-2" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                              />
                            </svg>
                            Desvincular
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {filterText ? (
              <p>Nenhum cliente encontrado com este filtro.</p>
            ) : (
              <p>Nenhum cliente vinculado a esta geradora.</p>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerenciarClientesModal;
