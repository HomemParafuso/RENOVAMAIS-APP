import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cliente } from '@/portal-admin/types/cliente';
import { useCliente } from '@/context/ClienteContext';
import { useGeradora } from '@/context/GeradoraContext';
import { useNotification } from '@/context/NotificationContext';

interface ClienteDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
}

const ClienteDetalhesModal = ({ isOpen, onClose, cliente }: ClienteDetalhesModalProps) => {
  const { updateCliente, removeCliente } = useCliente();
  const { geradoras } = useGeradora();
  const { addNotification } = useNotification();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [activeTab, setActiveTab] = useState("detalhes");

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
      setIsEditMode(false);
      setActiveTab("detalhes");
    }
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveDetalhes = async () => {
    if (!cliente || !formData.id) return;
    try {
      const updates = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpfCnpj: formData.cpfCnpj,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        geradoraId: formData.geradoraId,
      };
      await updateCliente(formData.id, updates);
      addNotification({ message: 'Detalhes do cliente atualizados com sucesso!', type: 'success' });
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar detalhes do cliente:', error);
      addNotification({ message: 'Erro ao atualizar detalhes do cliente.', type: 'error' });
    }
  };

  const handleSaveVinculacaoUsinas = async () => {
    if (!cliente || !formData.id) return;
    try {
      const updates = {
        usinaId: formData.usinaId,
      };
      await updateCliente(formData.id, updates);
      addNotification({ message: 'Vinculação de usinas atualizada com sucesso!', type: 'success' });
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar vinculação de usinas:', error);
      addNotification({ message: 'Erro ao atualizar vinculação de usinas.', type: 'error' });
    }
  };

  const handleSaveGestaoAcesso = async () => {
    if (!cliente || !formData.id) return;
    try {
      addNotification({ message: 'Funcionalidade de gestão de acesso em desenvolvimento.', type: 'info' });
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao salvar gestão de acesso:', error);
      addNotification({ message: 'Erro ao salvar gestão de acesso.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!cliente || !cliente.id) return;
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      try {
        await removeCliente(cliente.id);
        addNotification({ message: 'Cliente removido com sucesso!', type: 'success' });
        onClose();
      } catch (error) {
        console.error('Erro ao remover cliente:', error);
        addNotification({ message: 'Erro ao remover cliente.', type: 'error' });
      }
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Cliente' : 'Detalhes do Cliente'}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalhes">Detalhes do Cliente</TabsTrigger>
            <TabsTrigger value="usinas">Vinculação de Usinas</TabsTrigger>
            <TabsTrigger value="acesso">Gestão de Acesso</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="grid gap-4 py-4">
            <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" value={formData.telefone || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input id="cpfCnpj" name="cpfCnpj" value={formData.cpfCnpj || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" value={formData.endereco || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" name="estado" value={formData.estado || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" name="cep" value={formData.cep || ''} onChange={handleChange} disabled={!isEditMode} />
              </div>
              <div>
                <Label htmlFor="geradoraId">Geradora</Label>
                <Select name="geradoraId" value={formData.geradoraId || ''} onValueChange={(value) => handleSelectChange('geradoraId', value)} disabled={!isEditMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Geradora" />
                  </SelectTrigger>
                  <SelectContent>
                    {geradoras.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consumoMedio">Consumo Médio (kWh)</Label>
                <Input id="consumoMedio" name="consumoMedio" type="number" value={formData.consumoMedio || 'N/A'} disabled />
              </div>
            </div>
            <DialogFooter className="mt-4 sm:justify-end">
              {!isEditMode ? (
                <Button variant="outline" onClick={() => setIsEditMode(true)}>Editar</Button>
              ) : (
                <Button onClick={handleSaveDetalhes}>Salvar Dados do Cliente</Button>
              )}
            </DialogFooter>
          </TabsContent>

          <TabsContent value="usinas" className="grid gap-4 py-4">
            <h3 className="text-lg font-semibold mb-2">Vinculação de Usinas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usinaId">Usina Vinculada</Label>
                <Input id="usinaId" name="usinaId" value={formData.usinaId || 'N/A'} onChange={handleChange} disabled={!isEditMode} placeholder="ID da Usina" />
                <p className="text-sm text-muted-foreground mt-1">Esta funcionalidade será expandida para seleção de usina.</p>
              </div>
            </div>
            <DialogFooter className="mt-4 sm:justify-end">
              {!isEditMode ? (
                <Button variant="outline" onClick={() => setIsEditMode(true)}>Editar</Button>
              ) : (
                <Button onClick={handleSaveVinculacaoUsinas}>Salvar Vinculação de Usinas</Button>
              )}
            </DialogFooter>
          </TabsContent>

          <TabsContent value="acesso" className="grid gap-4 py-4">
            <h3 className="text-lg font-semibold mb-2">Gestão de Acesso</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="emailLogin">Email de Login</Label>
                <Input id="emailLogin" name="emailLogin" value={cliente.email || ''} disabled placeholder="Email do Cliente" />
                <p className="text-sm text-muted-foreground mt-1">Para redefinir senha, será necessário integrar com o Firebase Authentication.</p>
              </div>
              <Button variant="outline" disabled={!isEditMode}>Redefinir Senha (Em desenvolvimento)</Button>
            </div>
            <DialogFooter className="mt-4 sm:justify-end">
              {!isEditMode ? (
                <Button variant="outline" onClick={() => setIsEditMode(true)}>Editar</Button>
              ) : (
                <Button onClick={handleSaveGestaoAcesso}>Salvar Gestão de Acesso</Button>
              )}
            </DialogFooter>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 border-t pt-4">
          <Button variant="destructive" onClick={handleDelete}>Remover Cliente</Button>
          <Button onClick={onClose}>Fechar Modal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteDetalhesModal; 