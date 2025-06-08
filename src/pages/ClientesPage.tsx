import React, { useState, useEffect } from "react";
import { clienteService, ClienteApp } from "@/services/clienteService";
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

const ClientesPage = () => {
  const [clientes, setClientes] = useState<ClienteApp[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNovoClienteModalOpen, setIsNovoClienteModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteApp | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<ClienteApp | null>(null);
  const { toast } = useToast();

  // Carregar clientes do Firebase
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const clientesCarregados = await clienteService.getAll();
        setClientes(clientesCarregados);
        console.log('Clientes carregados:', clientesCarregados);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Ocorreu um erro ao carregar a lista de clientes.",
          variant: "destructive",
        });
      }
    };
    
    carregarClientes();
  }, [isNovoClienteModalOpen]); // Recarregar quando modal fechar

  const handleEnviarConvite = (cliente: ClienteApp) => {
    toast({
      title: "Convite enviado",
      description: "O convite foi enviado para o cliente com sucesso!",
    });
  };

  const handleExcluirCliente = async (cliente: ClienteApp) => {
    setClienteParaExcluir(cliente);
    
    // Confirmar exclusão
    if (confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}? Esta ação apenas ocultará o cliente da visualização, mas manterá os dados financeiros históricos e faturas na base.`)) {
      try {
        // Chamar o serviço para excluir o cliente do localStorage e do Firebase
        const sucesso = await clienteService.delete(cliente.id);
        
        if (sucesso) {
          // Atualizar a lista de clientes (removendo o cliente excluído)
          const clientesAtualizados = clientes.filter(c => c.id !== cliente.id);
          setClientes(clientesAtualizados);
          
          // Notificar o usuário
          toast({
            title: "Cliente excluído",
            description: `O cliente ${cliente.nome} foi excluído com sucesso.`,
          });
        } else {
          throw new Error('Não foi possível excluir o cliente');
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast({
          title: "Erro ao excluir cliente",
          description: "Ocorreu um erro ao excluir o cliente.",
          variant: "destructive",
        });
      }
    }
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
    
    const aValue = a[sortColumn as keyof ClienteApp];
    const bValue = b[sortColumn as keyof ClienteApp];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const handleViewClient = (cliente: ClienteApp) => {
    setClienteSelecionado(cliente);
    setIsViewModalOpen(true);
  };
  
  const handleEditClient = (cliente: ClienteApp) => {
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
                <TableRow key={cliente.id} onClick={() => handleViewClient(cliente)} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-semibold">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                      {cliente.nome}
                    </div>
                  </TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>{cliente.tipoCalculo === 'percentual' ? 'Percentual de Economia' : 'Valor Nominal'}</TableCell>
                  <TableCell>{cliente.usinaNome || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cliente.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      cliente.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cliente.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewClient(cliente)}>
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClient(cliente)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEnviarConvite(cliente)}>
                          <Send className="mr-2 h-4 w-4" /> Enviar Convite
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExcluirCliente(cliente)}>
                          <span className="text-red-600">Excluir</span>
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

      {/* Modal para Editar Cliente */}
      <EditarClienteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setClienteSelecionado(undefined);
          // Recarregar clientes após edição
          clienteService.getAll().then(setClientes);
        }}
        clienteId={clienteSelecionado?.id}
      />

      {/* Modal para Visualizar Cliente (reutilizando EditarClienteModal em modo somente leitura) */}
      <EditarClienteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setClienteSelecionado(undefined);
        }}
        clienteId={clienteSelecionado?.id}
        isViewOnly={true}
      />

      {/* Modal para Novo Cliente */}
      <NovoClienteModal
        isOpen={isNovoClienteModalOpen}
        onClose={() => setIsNovoClienteModalOpen(false)}
        onSave={() => {
          // Recarregar clientes após adicionar um novo
          clienteService.getAll().then(setClientes);
          setIsNovoClienteModalOpen(false);
        }}
      />
    </div>
  );
};

export default ClientesPage;
