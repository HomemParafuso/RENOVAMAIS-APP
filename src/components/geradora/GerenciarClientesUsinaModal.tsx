import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreVertical, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

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

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  consumoMedio: number;
  status: string;
  dataCadastro: string;
}

interface GerenciarClientesUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: UsinaGeradora | undefined;
}

const GerenciarClientesUsinaModal = ({ isOpen, onClose, geradora }: GerenciarClientesUsinaModalProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVincularClienteOpen, setIsVincularClienteOpen] = useState(false);
  const { toast } = useToast();

  // Carregar clientes vinculados à usina
  useEffect(() => {
    if (geradora) {
      // Simulando carregamento de clientes do localStorage ou API
      const clientesSalvos = localStorage.getItem(`clientes-usina-${geradora.id}`);
      if (clientesSalvos) {
        try {
          setClientes(JSON.parse(clientesSalvos));
        } catch (error) {
          console.error("Erro ao carregar clientes:", error);
          // Inicializar com dados de exemplo
          setClientes([
            {
              id: 1,
              nome: "João Silva",
              email: "joao.silva@exemplo.com",
              telefone: "(11) 98765-4321",
              consumoMedio: 350,
              status: "ativo",
              dataCadastro: "2025-01-15T10:30:00Z"
            },
            {
              id: 2,
              nome: "Maria Oliveira",
              email: "maria.oliveira@exemplo.com",
              telefone: "(11) 91234-5678",
              consumoMedio: 420,
              status: "ativo",
              dataCadastro: "2025-02-20T14:45:00Z"
            }
          ]);
        }
      } else {
        // Inicializar com dados de exemplo
        setClientes([
          {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@exemplo.com",
            telefone: "(11) 98765-4321",
            consumoMedio: 350,
            status: "ativo",
            dataCadastro: "2025-01-15T10:30:00Z"
          },
          {
            id: 2,
            nome: "Maria Oliveira",
            email: "maria.oliveira@exemplo.com",
            telefone: "(11) 91234-5678",
            consumoMedio: 420,
            status: "ativo",
            dataCadastro: "2025-02-20T14:45:00Z"
          }
        ]);
      }

      // Carregar clientes disponíveis para vincular
      const todosClientes = localStorage.getItem('clientes');
      if (todosClientes) {
        try {
          const clientesParsed = JSON.parse(todosClientes);
          // Filtrar clientes que não estão vinculados a esta usina
          const clientesIds = clientes.map(c => c.id);
          setClientesDisponiveis(clientesParsed.filter((c: Cliente) => !clientesIds.includes(c.id)));
        } catch (error) {
          console.error("Erro ao carregar clientes disponíveis:", error);
          setClientesDisponiveis([
            {
              id: 3,
              nome: "Carlos Pereira",
              email: "carlos.pereira@exemplo.com",
              telefone: "(11) 97777-8888",
              consumoMedio: 280,
              status: "ativo",
              dataCadastro: "2025-03-10T09:15:00Z"
            },
            {
              id: 4,
              nome: "Ana Santos",
              email: "ana.santos@exemplo.com",
              telefone: "(11) 96666-7777",
              consumoMedio: 510,
              status: "ativo",
              dataCadastro: "2025-03-25T16:20:00Z"
            }
          ]);
        }
      } else {
        setClientesDisponiveis([
          {
            id: 3,
            nome: "Carlos Pereira",
            email: "carlos.pereira@exemplo.com",
            telefone: "(11) 97777-8888",
            consumoMedio: 280,
            status: "ativo",
            dataCadastro: "2025-03-10T09:15:00Z"
          },
          {
            id: 4,
            nome: "Ana Santos",
            email: "ana.santos@exemplo.com",
            telefone: "(11) 96666-7777",
            consumoMedio: 510,
            status: "ativo",
            dataCadastro: "2025-03-25T16:20:00Z"
          }
        ]);
      }
    }
  }, [geradora]);

  // Salvar clientes no localStorage sempre que houver mudanças
  useEffect(() => {
    if (geradora && clientes.length >= 0) {
      localStorage.setItem(`clientes-usina-${geradora.id}`, JSON.stringify(clientes));
      console.log("Clientes salvos no localStorage:", clientes);
    }
  }, [clientes, geradora]);

  const handleVincularCliente = (cliente: Cliente) => {
    if (!geradora) return;
    
    // Adicionar cliente à lista de clientes vinculados
    setClientes([...clientes, cliente]);
    
    // Remover cliente da lista de disponíveis
    setClientesDisponiveis(clientesDisponiveis.filter(c => c.id !== cliente.id));
    
    // Atualizar contador de clientes vinculados na usina
    // (Isso seria feito através de uma API em um ambiente real)
    
    toast({
      title: "Cliente vinculado",
      description: `O cliente ${cliente.nome} foi vinculado à usina ${geradora.nome} com sucesso.`,
    });
    
    setIsVincularClienteOpen(false);
  };

  const handleDesvincularCliente = (cliente: Cliente) => {
    if (!geradora) return;
    
    // Remover cliente da lista de clientes vinculados
    setClientes(clientes.filter(c => c.id !== cliente.id));
    
    // Adicionar cliente de volta à lista de disponíveis
    setClientesDisponiveis([...clientesDisponiveis, cliente]);
    
    // Atualizar contador de clientes vinculados na usina
    // (Isso seria feito através de uma API em um ambiente real)
    
    toast({
      title: "Cliente desvinculado",
      description: `O cliente ${cliente.nome} foi desvinculado da usina ${geradora.nome}.`,
    });
  };

  // Filtragem de clientes
  const clientesFiltrados = clientes.filter(cliente => 
    searchTerm === "" || 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtragem de clientes disponíveis
  const clientesDisponiveisFiltrados = clientesDisponiveis.filter(cliente => 
    searchTerm === "" || 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!geradora) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Clientes da Usina</DialogTitle>
          <DialogDescription>
            Vincule ou desvincule clientes da usina {geradora.nome}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setIsVincularClienteOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Vincular Cliente
            </Button>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-5 px-4 py-3 border-b text-sm font-medium text-gray-500">
              <div className="col-span-2">Nome</div>
              <div>Email</div>
              <div>Consumo Médio</div>
              <div className="text-right">Ações</div>
            </div>
            
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="grid grid-cols-5 px-4 py-3 border-b last:border-0 items-center">
                  <div className="col-span-2 font-medium">{cliente.nome}</div>
                  <div className="text-sm">{cliente.email}</div>
                  <div>{cliente.consumoMedio} kWh</div>
                  <div className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDesvincularCliente(cliente)}>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Desvincular
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                Nenhum cliente vinculado a esta usina
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Modal para vincular clientes */}
      <Dialog open={isVincularClienteOpen} onOpenChange={setIsVincularClienteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vincular Cliente à Usina</DialogTitle>
            <DialogDescription>
              Selecione um cliente para vincular à usina {geradora.nome}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative flex-1 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente disponível..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-4 px-4 py-3 border-b text-sm font-medium text-gray-500">
                <div className="col-span-2">Nome</div>
                <div>Email</div>
                <div className="text-right">Ação</div>
              </div>
              
              {clientesDisponiveisFiltrados.length > 0 ? (
                clientesDisponiveisFiltrados.map((cliente) => (
                  <div key={cliente.id} className="grid grid-cols-4 px-4 py-3 border-b last:border-0 items-center">
                    <div className="col-span-2 font-medium">{cliente.nome}</div>
                    <div className="text-sm">{cliente.email}</div>
                    <div className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleVincularCliente(cliente)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Vincular
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente disponível para vincular
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVincularClienteOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default GerenciarClientesUsinaModal;
