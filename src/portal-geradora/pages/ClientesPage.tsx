
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Search, Eye, Edit, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditarClienteModal from "@/components/cliente/EditarClienteModal";
import NovoClienteModal from "@/components/cliente/NovoClienteModal";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  tipoCalculo: string;
  status: string;
  usina: string;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNovoClienteModalOpen, setIsNovoClienteModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar clientes do localStorage
  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes') || '[]');
    setClientes(clientesSalvos);
    console.log('Clientes carregados:', clientesSalvos);
  }, [isNovoClienteModalOpen]); // Recarregar quando modal fechar

  const handleEnviarConvite = (cliente: Cliente) => {
    toast({
      title: "Convite enviado",
      description: "O convite foi enviado para o cliente com sucesso!",
    });
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const sortedClientes = [...clientes].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aValue = a[sortColumn as keyof Cliente];
    const bValue = b[sortColumn as keyof Cliente];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const handleViewClient = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setIsViewModalOpen(true);
  };
  
  const handleEditClient = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os clientes da sua usina solar</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsNovoClienteModalOpen(true)}
        >
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
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        {clientes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum cliente cadastrado ainda.</p>
            <p className="text-sm mt-2">Clique em "Novo Cliente" para começar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("nome")}
                >
                  Nome {sortColumn === "nome" && (sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("cpf")}
                >
                  CPF/CNPJ {sortColumn === "cpf" && (sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("tipoCalculo")}
                >
                  Tipo de Cálculo {sortColumn === "tipoCalculo" && (sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("usina")}
                >
                  Usina {sortColumn === "usina" && (sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "")}
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium mr-3">
                        {cliente.nome.charAt(0)}
                      </div>
                      <span className="font-medium">{cliente.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.cpf || '-'}</TableCell>
                  <TableCell>{cliente.tipoCalculo}</TableCell>
                  <TableCell>{cliente.usina}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewClient(cliente)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClient(cliente)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEnviarConvite(cliente)}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Convite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {clienteSelecionado && (
        <>
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
        </>
      )}
      
      <NovoClienteModal
        isOpen={isNovoClienteModalOpen}
        onClose={() => setIsNovoClienteModalOpen(false)}
      />
    </div>
  );
};

export default ClientesPage;
