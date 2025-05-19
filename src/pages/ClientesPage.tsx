
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Search, RefreshCw, Eye, Edit, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditarClienteModal from "@/components/cliente/EditarClienteModal";
import { useToast } from "@/components/ui/use-toast";

const ClientesPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  const clientes = [
    {
      id: 1,
      nome: "Pablio Tacyanno",
      cpf: "",
      tipoCalculo: "Percentual de Economia",
      status: "Ativo"
    }
  ];

  const handleEnviarConvite = () => {
    toast({
      title: "Convite enviado",
      description: "O convite foi enviado para o cliente com sucesso!",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os clientes da sua usina solar</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <span className="mr-2">+</span>
          Novo Cliente
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nome, email ou CPF/CNPJ"
            className="pl-10"
          />
        </div>
        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-5 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Nome</div>
          <div>CPF/CNPJ</div>
          <div>Tipo de Cálculo</div>
          <div>Status</div>
          <div className="text-right">Ações</div>
        </div>
        
        {clientes.map((cliente) => (
          <div key={cliente.id} className="grid grid-cols-5 px-6 py-4 border-b last:border-0 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium mr-3">
                {cliente.nome.charAt(0)}
              </div>
              <span className="font-medium">{cliente.nome}</span>
            </div>
            <div>{cliente.cpf || '-'}</div>
            <div>{cliente.tipoCalculo}</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {cliente.status}
              </span>
            </div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsViewModalOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEnviarConvite}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Convite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <EditarClienteModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        isViewOnly={true}
      />

      <EditarClienteModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        isViewOnly={false}
      />
    </div>
  );
};

export default ClientesPage;
