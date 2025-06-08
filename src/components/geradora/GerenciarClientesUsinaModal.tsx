import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { UsinaGeradora } from "@/portal-admin/types/usinaGeradora";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, UserMinus, Check, X } from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { usinaService } from "@/services/usinaService";
import { Cliente } from "@/portal-admin/types/cliente";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface GerenciarClientesUsinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: UsinaGeradora;
  onClientesUpdated?: () => void;
}

const GerenciarClientesUsinaModal = ({ isOpen, onClose, geradora, onClientesUpdated }: GerenciarClientesUsinaModalProps) => {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesVinculados, setClientesVinculados] = useState<Cliente[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [clientesToRemove, setClientesToRemove] = useState<Cliente[]>([]);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar todos os clientes da geradora
      const todosClientes = await clienteService.getByGeradora(geradora.geradoraId);
      setClientes(todosClientes);
      
      // Filtrar clientes já vinculados à usina
      const vinculados = todosClientes.filter(cliente => 
        cliente.usinaId === geradora.id
      );
      setClientesVinculados(vinculados);
      
      // Filtrar clientes disponíveis (não vinculados a nenhuma usina ou vinculados a outra usina)
      const disponiveis = todosClientes.filter(cliente => 
        !cliente.usinaId || cliente.usinaId !== geradora.id
      );
      setClientesDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [geradora, toast]);

  // Carregar clientes quando o modal for aberto
  useEffect(() => {
    if (isOpen) {
      carregarClientes();
    }
  }, [isOpen, geradora, carregarClientes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCliente = (clienteId: string) => {
    setSelectedClientes(prev => {
      if (prev.includes(clienteId)) {
        return prev.filter(id => id !== clienteId);
      } else {
        return [...prev, clienteId];
      }
    });
  };

  const handleSelectAll = (clientes: Cliente[]) => {
    if (selectedClientes.length === clientes.length) {
      // Se todos já estão selecionados, desmarcar todos
      setSelectedClientes([]);
    } else {
      // Caso contrário, selecionar todos
      setSelectedClientes(clientes.map(cliente => cliente.id));
    }
  };

  const handleVincularClientes = async () => {
    if (selectedClientes.length === 0) {
      toast({
        title: "Nenhum cliente selecionado",
        description: "Selecione pelo menos um cliente para vincular à usina.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Atualizar cada cliente selecionado
      for (const clienteId of selectedClientes) {
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
          await clienteService.update(clienteId, {
            ...cliente,
            usinaId: geradora.id
          });
        }
      }

      // Atualizar o contador de clientes na usina
      const novoNumeroClientes = clientesVinculados.length + selectedClientes.filter(id => 
        !clientesVinculados.some(c => c.id === id)
      ).length;
      
      // Atualizar a usina com o novo número de clientes
      await usinaService.update(geradora.id, {
        ...geradora,
        clientesVinculados: novoNumeroClientes
      });

      toast({
        title: "Clientes vinculados com sucesso",
        description: `${selectedClientes.length} cliente(s) vinculado(s) à usina "${geradora.nome}".`
      });

      // Recarregar a lista de clientes
      carregarClientes();
      
      // Limpar seleção
      setSelectedClientes([]);
      
      // Notificar o componente pai que os clientes foram atualizados
      if (onClientesUpdated) {
        onClientesUpdated();
      }
    } catch (error) {
      console.error("Erro ao vincular clientes:", error);
      toast({
        title: "Erro ao vincular clientes",
        description: "Ocorreu um erro ao vincular os clientes à usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmRemoverClientes = () => {
    const clientesSelecionados = clientesVinculados.filter(cliente => 
      selectedClientes.includes(cliente.id)
    );
    
    if (clientesSelecionados.length === 0) {
      toast({
        title: "Nenhum cliente selecionado",
        description: "Selecione pelo menos um cliente para desvincular da usina.",
        variant: "destructive"
      });
      return;
    }
    
    setClientesToRemove(clientesSelecionados);
    setIsConfirmDialogOpen(true);
  };

  const handleRemoverClientes = async () => {
    try {
      // Atualizar cada cliente selecionado
      for (const cliente of clientesToRemove) {
        await clienteService.update(cliente.id, {
          ...cliente,
          usinaId: null
        });
      }

      // Atualizar o contador de clientes na usina
      const novoNumeroClientes = clientesVinculados.length - clientesToRemove.length;
      
      // Atualizar a usina com o novo número de clientes
      await usinaService.update(geradora.id, {
        ...geradora,
        clientesVinculados: novoNumeroClientes >= 0 ? novoNumeroClientes : 0
      });

      toast({
        title: "Clientes desvinculados com sucesso",
        description: `${clientesToRemove.length} cliente(s) desvinculado(s) da usina "${geradora.nome}".`
      });

      // Recarregar a lista de clientes
      carregarClientes();
      
      // Limpar seleção
      setSelectedClientes([]);
      setClientesToRemove([]);
      setIsConfirmDialogOpen(false);
      
      // Notificar o componente pai que os clientes foram atualizados
      if (onClientesUpdated) {
        onClientesUpdated();
      }
    } catch (error) {
      console.error("Erro ao desvincular clientes:", error);
      toast({
        title: "Erro ao desvincular clientes",
        description: "Ocorreu um erro ao desvincular os clientes da usina. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Filtrar clientes com base no termo de busca
  const filteredClientesVinculados = clientesVinculados.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClientesDisponiveis = clientesDisponiveis.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Clientes da Usina</DialogTitle>
            <DialogDescription>
              Vincule ou desvincule clientes da usina "{geradora.nome}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, email ou CPF/CNPJ"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-10">Carregando clientes...</div>
            ) : (
              <div className="space-y-8">
                {/* Clientes vinculados */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Clientes Vinculados ({filteredClientesVinculados.length})</h3>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleConfirmRemoverClientes}
                      disabled={selectedClientes.length === 0 || !selectedClientes.some(id => 
                        clientesVinculados.some(c => c.id === id)
                      )}
                      className="flex items-center"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Desvincular Selecionados
                    </Button>
                  </div>
                  
                  {filteredClientesVinculados.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <p className="text-gray-500">Nenhum cliente vinculado a esta usina.</p>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox 
                                checked={selectedClientes.length > 0 && 
                                  filteredClientesVinculados.every(cliente => 
                                    selectedClientes.includes(cliente.id)
                                  )}
                                onCheckedChange={() => handleSelectAll(filteredClientesVinculados)}
                              />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CPF/CNPJ</TableHead>
                            <TableHead>Telefone</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClientesVinculados.map(cliente => (
                            <TableRow key={cliente.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedClientes.includes(cliente.id)}
                                  onCheckedChange={() => handleSelectCliente(cliente.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{cliente.nome}</TableCell>
                              <TableCell>{cliente.email}</TableCell>
                              <TableCell>{cliente.cpfCnpj}</TableCell>
                              <TableCell>{cliente.telefone}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                
                {/* Clientes disponíveis */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Clientes Disponíveis ({filteredClientesDisponiveis.length})</h3>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={handleVincularClientes}
                      disabled={selectedClientes.length === 0 || !selectedClientes.some(id => 
                        clientesDisponiveis.some(c => c.id === id)
                      )}
                      className="flex items-center bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Vincular Selecionados
                    </Button>
                  </div>
                  
                  {filteredClientesDisponiveis.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <p className="text-gray-500">Nenhum cliente disponível para vincular.</p>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox 
                                checked={selectedClientes.length > 0 && 
                                  filteredClientesDisponiveis.every(cliente => 
                                    selectedClientes.includes(cliente.id)
                                  )}
                                onCheckedChange={() => handleSelectAll(filteredClientesDisponiveis)}
                              />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CPF/CNPJ</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClientesDisponiveis.map(cliente => (
                            <TableRow key={cliente.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedClientes.includes(cliente.id)}
                                  onCheckedChange={() => handleSelectCliente(cliente.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{cliente.nome}</TableCell>
                              <TableCell>{cliente.email}</TableCell>
                              <TableCell>{cliente.cpfCnpj}</TableCell>
                              <TableCell>{cliente.telefone}</TableCell>
                              <TableCell>
                                {cliente.usinaId ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Vinculado a outra usina
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Disponível
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para remover clientes */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar desvinculação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desvincular {clientesToRemove.length} cliente(s) da usina "{geradora.nome}"?
              <br /><br />
              Os clientes não serão excluídos, apenas desvinculados desta usina.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoverClientes} className="bg-red-600 hover:bg-red-700">
              Sim, desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GerenciarClientesUsinaModal;
