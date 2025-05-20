
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, MoreVertical, Eye, Edit, Users, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DetalhesGeradoraModal from "@/components/geradora/DetalhesGeradoraModal";
import NovaGeradoraModal from "@/components/geradora/NovaGeradoraModal";
import EditarGeradoraModal from "@/components/geradora/EditarGeradoraModal";
import GerenciarClientesModal from "@/components/geradora/GerenciarClientesModal";
import { useToast } from "@/components/ui/use-toast";

interface Geradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  status: string;
  clientesVinculados: number;
  marcaInversor?: string;
  apiKey?: string;
}

const GeradorasPage = () => {
  const [isDetalheGeradoraModalOpen, setIsDetalheGeradoraModalOpen] = useState(false);
  const [isNovaGeradoraModalOpen, setIsNovaGeradoraModalOpen] = useState(false);
  const [isEditarGeradoraModalOpen, setIsEditarGeradoraModalOpen] = useState(false);
  const [isGerenciarClientesModalOpen, setIsGerenciarClientesModalOpen] = useState(false);
  const [geradoraSelecionada, setGeradoraSelecionada] = useState<Geradora | undefined>(undefined);
  const { toast } = useToast();

  const geradoras: Geradora[] = [
    {
      id: 1,
      nome: "Usina Solar São Paulo I",
      potencia: "500 kWp",
      localizacao: "São Paulo, SP",
      status: "Ativo",
      clientesVinculados: 25,
      marcaInversor: "fronius",
      apiKey: "api123456"
    }
  ];

  const handleVerDetalhes = (geradora: Geradora) => {
    setGeradoraSelecionada(geradora);
    setIsDetalheGeradoraModalOpen(true);
  };

  const handleEditar = (geradora: Geradora) => {
    setGeradoraSelecionada(geradora);
    setIsEditarGeradoraModalOpen(true);
  };

  const handleGerenciarClientes = (geradora: Geradora) => {
    setGeradoraSelecionada(geradora);
    setIsGerenciarClientesModalOpen(true);
  };

  const handleNovaGeradora = () => {
    setIsNovaGeradoraModalOpen(true);
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
            <SelectItem value="manutencao">Em Manutenção</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
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
        
        {geradoras.map((geradora) => (
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
        ))}
      </div>

      <DetalhesGeradoraModal
        isOpen={isDetalheGeradoraModalOpen}
        onClose={() => setIsDetalheGeradoraModalOpen(false)}
        geradora={geradoraSelecionada}
      />
      
      <NovaGeradoraModal
        isOpen={isNovaGeradoraModalOpen}
        onClose={() => setIsNovaGeradoraModalOpen(false)}
      />
      
      <EditarGeradoraModal
        isOpen={isEditarGeradoraModalOpen}
        onClose={() => setIsEditarGeradoraModalOpen(false)}
        geradora={geradoraSelecionada}
      />
      
      <GerenciarClientesModal
        isOpen={isGerenciarClientesModalOpen}
        onClose={() => setIsGerenciarClientesModalOpen(false)}
        geradora={geradoraSelecionada}
      />
    </div>
  );
};

export default GeradorasPage;
