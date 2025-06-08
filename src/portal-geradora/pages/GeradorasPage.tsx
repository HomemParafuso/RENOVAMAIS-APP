
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
import NovaUsinaModal from "@/components/geradora/NovaUsinaModal";
import DetalhesUsinaModal from "@/components/geradora/DetalhesUsinaModal";
import EditarUsinaModal from "@/components/geradora/EditarUsinaModal";
import GerenciarClientesUsinaModal from "@/components/geradora/GerenciarClientesUsinaModal";
import { useToast } from "@/components/ui/use-toast";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
import { usinaService } from "@/services/usinaService";
import { useGeradoraAuth } from "@/context/GeradoraAuthContext";

const GeradorasPage = () => {
  const [isDetalheGeradoraModalOpen, setIsDetalheGeradoraModalOpen] = useState(false);
  const [isNovaUsinaModalOpen, setIsNovaUsinaModalOpen] = useState(false);
  const [isEditarGeradoraModalOpen, setIsEditarGeradoraModalOpen] = useState(false);
  const [isGerenciarClientesModalOpen, setIsGerenciarClientesModalOpen] = useState(false);
  const [usinaSelecionada, setUsinaSelecionada] = useState<UsinaGeradora | undefined>(undefined);
  const [usinas, setUsinas] = useState<UsinaGeradora[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { geradora } = useGeradoraAuth();

  // Carregar usinas geradoras da geradora logada
  useEffect(() => {
    const carregarUsinas = async () => {
      setLoading(true);
      try {
        if (geradora?.id) {
          const usinasGeradora = await usinaService.getByGeradora(geradora.id);
          setUsinas(usinasGeradora);
          console.log("Usinas carregadas:", usinasGeradora);
        } else {
          console.log("Geradora não está logada ou não tem ID");
          setUsinas([]);
        }
      } catch (error) {
        console.error("Erro ao carregar usinas:", error);
        toast({
          title: "Erro ao carregar usinas",
          description: "Não foi possível carregar as usinas geradoras. Tente novamente mais tarde.",
          variant: "destructive"
        });
        setUsinas([]);
      } finally {
        setLoading(false);
      }
    };

    carregarUsinas();
  }, [geradora]);

  // Filtragem de usinas
  const usinasFiltradas = usinas.filter(usina => {
    // Filtro de busca por nome ou localização
    const matchesSearch = searchTerm === "" || 
      usina.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      usina.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = statusFilter === "todos" || 
      usina.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleVerDetalhes = (usina: UsinaGeradora) => {
    setUsinaSelecionada(usina);
    setIsDetalheGeradoraModalOpen(true);
  };

  const handleEditar = (usina: UsinaGeradora) => {
    console.log("Editando usina:", usina);
    setUsinaSelecionada({...usina});
    setIsEditarGeradoraModalOpen(true);
  };

  const handleGerenciarClientes = (usina: UsinaGeradora) => {
    setUsinaSelecionada(usina);
    setIsGerenciarClientesModalOpen(true);
  };

  const handleNovaUsina = () => {
    setIsNovaUsinaModalOpen(true);
  };

  // Adicionar nova usina
  const handleSaveNewUsina = async (novaUsina: UsinaGeradora) => {
    setUsinas(usinas => [...usinas, novaUsina]);
    console.log("Nova usina adicionada:", novaUsina);
  };

  // Atualizar usina existente
  const handleUpdateUsina = async (usinaAtualizada: UsinaGeradora) => {
    console.log("Atualizando usina:", usinaAtualizada);
    
    try {
      const resultado = await usinaService.update(usinaAtualizada.id, usinaAtualizada);
      
      if (resultado) {
        setUsinas(usinas => 
          usinas.map(u => 
            u.id === usinaAtualizada.id ? resultado : u
          )
        );
        
        toast({
          title: "Usina atualizada",
          description: `As alterações na usina ${usinaAtualizada.nome} foram salvas com sucesso.`,
        });
        
        console.log("Usina atualizada:", resultado);
      } else {
        throw new Error("Falha ao atualizar usina");
      }
    } catch (error) {
      console.error("Erro ao atualizar usina:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Excluir usina
  const handleDeleteUsina = async (usina: UsinaGeradora) => {
    try {
      const sucesso = await usinaService.delete(usina.id);
      
      if (sucesso) {
        setUsinas(usinas => usinas.filter(u => u.id !== usina.id));
        toast({
          title: "Usina excluída",
          description: `A usina ${usina.nome} foi excluída com sucesso`,
        });
        console.log("Usina excluída:", usina);
      } else {
        throw new Error("Falha ao excluir usina");
      }
    } catch (error) {
      console.error("Erro ao excluir usina:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a usina. Tente novamente.",
        variant: "destructive"
      });
    }
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
          <h1 className="text-2xl font-bold">Usinas Geradoras</h1>
          <p className="text-muted-foreground">Gerencie suas usinas geradoras de energia solar</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={handleNovaUsina}
        >
          <span className="mr-2">+</span>
          Nova Usina
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

      {loading ? (
        <div className="bg-white rounded-md border p-8 text-center">
          <p>Carregando usinas geradoras...</p>
        </div>
      ) : (
        <div className="bg-white rounded-md border">
          <div className="grid grid-cols-6 px-6 py-3 border-b text-sm font-medium text-gray-500">
            <div>Nome</div>
            <div>Potência</div>
            <div>Localização</div>
            <div>Status</div>
            <div>Clientes Vinculados</div>
            <div className="text-right">Ações</div>
          </div>
          
          {usinasFiltradas.length > 0 ? (
            usinasFiltradas.map((usina) => (
              <div key={usina.id} className="grid grid-cols-6 px-6 py-4 border-b last:border-0 items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-medium mr-3">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{usina.nome}</span>
                </div>
                <div>{usina.potencia}</div>
                <div>{usina.localizacao}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    usina.status === 'ativo' ? 'bg-green-100 text-green-800' : 
                    usina.status === 'inativo' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {usina.status === 'ativo' ? 'Ativo' : 
                     usina.status === 'inativo' ? 'Inativo' : 
                     'Em Manutenção'}
                  </span>
                </div>
                <div>{usina.clientesVinculados}</div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleVerDetalhes(usina)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditar(usina)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGerenciarClientes(usina)}>
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
              {usinas.length === 0 ? 
                "Nenhuma usina geradora cadastrada. Clique em 'Nova Usina' para adicionar." : 
                "Nenhuma usina encontrada com os filtros selecionados"}
            </div>
          )}
        </div>
      )}

      <DetalhesUsinaModal
        isOpen={isDetalheGeradoraModalOpen}
        onClose={() => setIsDetalheGeradoraModalOpen(false)}
        geradora={usinaSelecionada}
      />
      
      <NovaUsinaModal
        isOpen={isNovaUsinaModalOpen}
        onClose={() => setIsNovaUsinaModalOpen(false)}
        onSave={handleSaveNewUsina}
        usinas={usinas}
      />
      
      <EditarUsinaModal
        isOpen={isEditarGeradoraModalOpen}
        onClose={() => setIsEditarGeradoraModalOpen(false)}
        geradora={usinaSelecionada}
        onSave={handleUpdateUsina}
        onDelete={handleDeleteUsina}
      />
      
      <GerenciarClientesUsinaModal
        isOpen={isGerenciarClientesModalOpen}
        onClose={() => setIsGerenciarClientesModalOpen(false)}
        geradora={usinaSelecionada}
      />
    </div>
  );
};

export default GeradorasPage;
