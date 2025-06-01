
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Edit, Users, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NovaGeradoraModal from "@/components/geradora/NovaGeradoraModal";
import DetalhesUsinaModal from "@/components/geradora/DetalhesUsinaModal";
import EditarUsinaModal from "@/components/geradora/EditarUsinaModal";
import GerenciarClientesUsinaModal from "@/components/geradora/GerenciarClientesUsinaModal";
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

const GeradorasPage = () => {
  const [isDetalheGeradoraModalOpen, setIsDetalheGeradoraModalOpen] = useState(false);
  const [isNovaGeradoraModalOpen, setIsNovaGeradoraModalOpen] = useState(false);
  const [isEditarGeradoraModalOpen, setIsEditarGeradoraModalOpen] = useState(false);
  const [isGerenciarClientesModalOpen, setIsGerenciarClientesModalOpen] = useState(false);
  const [geradoraSelecionada, setGeradoraSelecionada] = useState<UsinaGeradora | undefined>(undefined);
  const [geradoras, setGeradoras] = useState<UsinaGeradora[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { toast } = useToast();

  // Carregar geradoras do localStorage ao iniciar
  useEffect(() => {
    const geradorasSalvas = localStorage.getItem('geradoras');
    if (geradorasSalvas) {
      try {
        setGeradoras(JSON.parse(geradorasSalvas));
      } catch (error) {
        console.error("Erro ao carregar geradoras:", error);
        // Inicializar com dado padrão se houver erro
        setGeradoras([{
          id: 1,
          nome: "Usina Solar São Paulo I",
          potencia: "500 kWp",
          localizacao: "São Paulo, SP",
          status: "Ativo",
          clientesVinculados: 25,
          marcaInversor: "fronius",
          apiKey: "api123456"
        }]);
      }
    } else {
      // Inicializar com dado padrão se não houver nada salvo
      setGeradoras([{
        id: 1,
        nome: "Usina Solar São Paulo I",
        potencia: "500 kWp",
        localizacao: "São Paulo, SP",
        status: "Ativo",
        clientesVinculados: 25,
        marcaInversor: "fronius",
        apiKey: "api123456"
      }]);
    }
  }, []);

  // Salvar geradoras no localStorage sempre que houver mudanças
  useEffect(() => {
    if (geradoras.length > 0) {
      localStorage.setItem('geradoras', JSON.stringify(geradoras));
      console.log("Geradoras salvas no localStorage:", geradoras);
    }
  }, [geradoras]);

  // Filtragem de geradoras
  const geradorasFiltradas = geradoras.filter(geradora => {
    // Filtro de busca por nome ou localização
    const matchesSearch = searchTerm === "" || 
      geradora.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      geradora.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = statusFilter === "todos" || 
      geradora.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleVerDetalhes = (geradora: UsinaGeradora) => {
    setGeradoraSelecionada(geradora);
    setIsDetalheGeradoraModalOpen(true);
  };

  const handleEditar = (geradora: UsinaGeradora) => {
    console.log("Editando geradora:", geradora);
    setGeradoraSelecionada({...geradora});
    setIsEditarGeradoraModalOpen(true);
  };

  const handleGerenciarClientes = (geradora: UsinaGeradora) => {
    setGeradoraSelecionada(geradora);
    setIsGerenciarClientesModalOpen(true);
  };

  const handleNovaGeradora = () => {
    setIsNovaGeradoraModalOpen(true);
  };

  // Adicionar nova geradora
  const handleSaveNewGeradora = (novaGeradora: UsinaGeradora) => {
    setGeradoras(geradoras => [...geradoras, novaGeradora]);
    console.log("Nova geradora adicionada:", novaGeradora);
  };

  // Atualizar geradora existente
  const handleUpdateGeradora = (geradoraAtualizada: UsinaGeradora) => {
    console.log("Atualizando geradora:", geradoraAtualizada);
    
    setGeradoras(geradoras => 
      geradoras.map(g => 
        g.id === geradoraAtualizada.id ? geradoraAtualizada : g
      )
    );
    
    toast({
      title: "Geradora atualizada",
      description: `As alterações na geradora ${geradoraAtualizada.nome} foram salvas com sucesso.`,
    });
    
    console.log("Geradora atualizada:", geradoraAtualizada);
  };
  
  // Excluir geradora
  const handleDeleteGeradora = (geradora: UsinaGeradora) => {
    setGeradoras(geradoras => geradoras.filter(g => g.id !== geradora.id));
    toast({
      title: "Geradora excluída",
      description: `A geradora ${geradora.nome} foi excluída com sucesso`,
    });
    console.log("Geradora excluída:", geradora);
  };

  // Realizar busca quando o usuário pressionar Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // A busca já acontece automaticamente pelo filtro
      console.log("Buscando por:", searchTerm);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Geradoras</h1>
          <p className="text-muted-foreground">Gerencie suas usinas geradoras de energia solar</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={handleNovaGeradora}
        >
          <span className="mr-2">+</span>
          Nova Geradora
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou localização"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setSearchTerm("")}
          className="hidden sm:flex"
        >
          Limpar
        </Button>
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="manutencao">Em Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-6 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Nome</div>
          <div>Potência</div>
          <div>Localização</div>
          <div>Status</div>
          <div>Clientes Vinculados</div>
          <div className="text-right">Ações</div>
        </div>
        
        {geradorasFiltradas.length > 0 ? (
          geradorasFiltradas.map((geradora) => (
            <div key={geradora.id} className="grid grid-cols-6 px-6 py-4 border-b last:border-0 items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-medium mr-3">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-medium">{geradora.nome}</span>
              </div>
              <div>{geradora.potencia}</div>
              <div>{geradora.localizacao}</div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {geradora.status}
                </span>
              </div>
              <div>{geradora.clientesVinculados}</div>
              <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleVerDetalhes(geradora)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditar(geradora)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGerenciarClientes(geradora)}>
                      <Users className="h-4 w-4 mr-2" />
                      Gerenciar Clientes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            Nenhuma geradora encontrada com os filtros selecionados
          </div>
        )}
      </div>

      <DetalhesUsinaModal
        isOpen={isDetalheGeradoraModalOpen}
        onClose={() => setIsDetalheGeradoraModalOpen(false)}
        geradora={geradoraSelecionada}
      />
      
      <NovaGeradoraModal
        isOpen={isNovaGeradoraModalOpen}
        onClose={() => setIsNovaGeradoraModalOpen(false)}
        onSave={handleSaveNewGeradora}
        geradoras={geradoras}
        isPortalGeradora={true}
      />
      
      <EditarUsinaModal
        isOpen={isEditarGeradoraModalOpen}
        onClose={() => setIsEditarGeradoraModalOpen(false)}
        geradora={geradoraSelecionada}
        onSave={handleUpdateGeradora}
        onDelete={handleDeleteGeradora}
      />
      
      <GerenciarClientesUsinaModal
        isOpen={isGerenciarClientesModalOpen}
        onClose={() => setIsGerenciarClientesModalOpen(false)}
        geradora={geradoraSelecionada}
      />
    </div>
  );
};

export default GeradorasPage;
