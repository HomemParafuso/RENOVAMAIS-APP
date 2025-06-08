import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Users, Power, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
import { usinaService } from "@/services/usinaService";
import NovaUsinaModal from "@/components/geradora/NovaUsinaModal";
import EditarUsinaModal from "@/components/geradora/EditarUsinaModal";
import GerenciarClientesUsinaModal from "@/components/geradora/GerenciarClientesUsinaModal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const UsinasPage = () => {
  const { toast } = useToast();
  const [usinas, setUsinas] = useState<UsinaGeradora[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNovaUsinaModalOpen, setIsNovaUsinaModalOpen] = useState(false);
  const [isEditarUsinaModalOpen, setIsEditarUsinaModalOpen] = useState(false);
  const [isGerenciarClientesModalOpen, setIsGerenciarClientesModalOpen] = useState(false);
  const [selectedUsina, setSelectedUsina] = useState<UsinaGeradora | null>(null);
  const [activeTab, setActiveTab] = useState("todas");
  const [isDetalhesUsinaModalOpen, setIsDetalhesUsinaModalOpen] = useState(false);
  
  // Obter o ID da geradora do usuário logado (simulado por enquanto)
  const geradoraId = "geradora-123"; // Substituir pelo ID real da geradora logada

  useEffect(() => {
    carregarUsinas();
  }, []);

  const carregarUsinas = async () => {
    setLoading(true);
    try {
      const usinasData = await usinaService.getUsinasByGeradoraId(geradoraId);
      setUsinas(usinasData);
    } catch (error) {
      console.error("Erro ao carregar usinas:", error);
      toast({
        title: "Erro ao carregar usinas",
        description: "Não foi possível carregar a lista de usinas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarNovaUsina = async (usina: Omit<UsinaGeradora, 'id'>) => {
    try {
      const novaUsina = await usinaService.create(usina);
      if (novaUsina) {
        setUsinas(prev => [novaUsina, ...prev]);
        toast({
          title: "Usina cadastrada com sucesso",
          description: `A usina "${usina.nome}" foi cadastrada com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar usina:", error);
      toast({
        title: "Erro ao cadastrar usina",
        description: "Ocorreu um erro ao cadastrar a usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAtualizarUsina = async (usina: UsinaGeradora) => {
    try {
      const usinaAtualizada = await usinaService.update(usina.id, usina);
      if (usinaAtualizada) {
        setUsinas(prev => prev.map(u => u.id === usina.id ? usinaAtualizada : u));
        toast({
          title: "Usina atualizada com sucesso",
          description: `A usina "${usina.nome}" foi atualizada com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar usina:", error);
      toast({
        title: "Erro ao atualizar usina",
        description: "Ocorreu um erro ao atualizar a usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExcluirUsina = async (usina: UsinaGeradora) => {
    try {
      const sucesso = await usinaService.delete(usina.id);
      if (sucesso) {
        setUsinas(prev => prev.filter(u => u.id !== usina.id));
        toast({
          title: "Usina excluída com sucesso",
          description: `A usina "${usina.nome}" foi excluída com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao excluir usina:", error);
      toast({
        title: "Erro ao excluir usina",
        description: "Ocorreu um erro ao excluir a usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditarUsina = (usina: UsinaGeradora) => {
    setSelectedUsina(usina);
    setIsEditarUsinaModalOpen(true);
  };

  const handleViewUsina = (usina: UsinaGeradora) => {
    setSelectedUsina(usina);
    setIsDetalhesUsinaModalOpen(true);
  };

  const handleGerenciarClientes = (usina: UsinaGeradora) => {
    setSelectedUsina(usina);
    setIsGerenciarClientesModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-gray-500">Inativo</Badge>;
      case 'manutencao':
        return <Badge className="bg-yellow-500">Em Manutenção</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Não informada";
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Filtrar usinas com base na aba ativa
  const usinasFiltradas = usinas.filter(usina => {
    if (activeTab === "todas") return true;
    return usina.status === activeTab;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usinas Geradoras</h1>
        <Button 
          onClick={() => setIsNovaUsinaModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Usina
        </Button>
      </div>

      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="ativo">Ativas</TabsTrigger>
          <TabsTrigger value="inativo">Inativas</TabsTrigger>
          <TabsTrigger value="manutencao">Em Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="text-center py-10">Carregando usinas...</div>
          ) : usinasFiltradas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma usina encontrada.</p>
              {activeTab !== "todas" && (
                <p className="text-gray-500 mt-2">Tente selecionar outra categoria ou cadastre uma nova usina.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usinasFiltradas.map((usina) => (
                <Card 
                  key={usina.id} 
                  className="overflow-hidden cursor-pointer"
                  onClick={() => handleViewUsina(usina)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{usina.nome}</CardTitle>
                      {getStatusBadge(usina.status)}
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {usina.localizacao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Clientes:</span>
                        <span className="ml-2">{usina.clientesVinculados || 0}</span>
                      </div>
                      
                      <div className="flex justify-between mt-4 pt-3 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGerenciarClientes(usina);
                          }}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Clientes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarUsina(usina);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <NovaUsinaModal 
        isOpen={isNovaUsinaModalOpen}
        onClose={() => setIsNovaUsinaModalOpen(false)}
        geradoraId={geradoraId}
        onSave={handleSalvarNovaUsina}
      />

      {selectedUsina && (
        <>
          <EditarUsinaModal 
            isOpen={isEditarUsinaModalOpen}
            onClose={() => setIsEditarUsinaModalOpen(false)}
            geradora={selectedUsina}
            onSave={handleAtualizarUsina}
            onDelete={handleExcluirUsina}
          />

          <EditarUsinaModal
            isOpen={isDetalhesUsinaModalOpen}
            onClose={() => setIsDetalhesUsinaModalOpen(false)}
            geradora={selectedUsina}
            onSave={handleAtualizarUsina}
            onDelete={handleExcluirUsina}
            isViewOnly={true}
          />

          <GerenciarClientesUsinaModal 
            isOpen={isGerenciarClientesModalOpen}
            onClose={() => setIsGerenciarClientesModalOpen(false)}
            geradora={selectedUsina}
            onClientesUpdated={carregarUsinas}
          />
        </>
      )}
    </div>
  );
};

export default UsinasPage;
