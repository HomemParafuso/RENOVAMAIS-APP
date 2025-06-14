import React, { useState, useEffect } from "react";
import { clienteService, ClienteApp, Imovel } from "@/services/clienteService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Componente para o formulário de informações pessoais
const InformacoesForm = ({
  readOnly = false,
  cliente,
  onClienteChange
}: { 
  readOnly?: boolean; 
  cliente?: ClienteApp; 
  onClienteChange: (clienteAtualizado: ClienteApp) => void; 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.nome || ""}</div>
      ) : (
        <Input 
          id="nome" 
          value={cliente?.nome || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, nome: e.target.value })} 
        />
      )}
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.email || ""}</div>
      ) : (
        <Input 
          id="email" 
          type="email" 
          value={cliente?.email || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, email: e.target.value })} 
        />
      )}
    </div>
    <div>
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.cpf || ""}</div>
      ) : (
        <Input 
          id="cpf" 
          value={cliente?.cpf || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, cpf: e.target.value })} 
        />
      )}
    </div>
    <div>
      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.telefone || ""}</div>
      ) : (
        <Input 
          id="telefone" 
          value={cliente?.telefone || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, telefone: e.target.value })} 
        />
      )}
    </div>
    <div className="md:col-span-2">
      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Principal</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.endereco || "Endereço de correspondência ou principal"}</div>
      ) : (
        <Input 
          id="endereco" 
          placeholder="Endereço de correspondência ou principal" 
          value={cliente?.endereco || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, endereco: e.target.value })} 
        />
      )}
    </div>
    <div>
      <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data de Adesão</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.dataAdesao || "dd / mm / aaaa"}</div>
      ) : (
        <Input 
          id="data" 
          placeholder="dd / mm / aaaa" 
          value={cliente?.dataAdesao || ""} 
          onChange={(e) => onClienteChange({ ...cliente!, dataAdesao: e.target.value })} 
        />
      )}
    </div>
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.status || "Ativo"}</div>
      ) : (
        <Select 
          value={cliente?.status || "ativo"} 
          onValueChange={(value) => onClienteChange({ ...cliente!, status: value as 'ativo' | 'inativo' | 'pendente' })} 
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
    <div className="md:col-span-2">
      <label htmlFor="potencia" className="block text-sm font-medium text-gray-700 mb-1">Potência Contratada Total (kWp)</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.potenciaContratadaTotal || "0"}</div>
      ) : (
        <Input 
          id="potencia" 
          type="number" 
          value={cliente?.potenciaContratadaTotal || 0} 
          onChange={(e) => onClienteChange({ ...cliente!, potenciaContratadaTotal: parseFloat(e.target.value) || 0 })} 
        />
      )}
    </div>
  </div>
);

// Componente para configuração de cálculo
const ConfiguracaoForm = ({
  readOnly = false,
  cliente,
  onClienteChange
}: {
  readOnly?: boolean;
  cliente?: ClienteApp;
  onClienteChange: (clienteAtualizado: ClienteApp) => void;
}) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
        {readOnly ? (
          <div className="p-2 bg-gray-50 border rounded-md">{cliente?.tipoCalculo === "percentual" ? "Percentual de Economia" : "Valor Nominal"}</div>
        ) : (
          <Select
            value={cliente?.tipoCalculo || "percentual"}
            onValueChange={(value) => onClienteChange({ ...cliente!, tipoCalculo: value })}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Selecione o tipo de cálculo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentual">Percentual de Economia</SelectItem>
              <SelectItem value="nominal">Valor Nominal</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="desconto" className="block text-sm font-medium text-gray-700 mb-1">Percentual de Desconto Nominal (s/ TU+TE)</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">{cliente?.percentualEconomia || "0"}</div>
          ) : (
            <Input
              id="desconto"
              type="number"
              value={cliente?.percentualEconomia || 0}
              onChange={(e) => onClienteChange({ ...cliente!, percentualEconomia: parseFloat(e.target.value) || 0 })}
            />
          )}
        </div>
        <div>
          <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-1">Fonte da Tarifa (TU e TE)</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">{cliente?.fonteTarifa === "global" ? "Global (Configuração Geral)" : "Customizada"}</div>
          ) : (
            <Select
              value={cliente?.fonteTarifa || "global"}
              onValueChange={(value) => onClienteChange({ ...cliente!, fonteTarifa: value })}
            >
              <SelectTrigger id="fonte">
                <SelectValue placeholder="Selecione a fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global (Configuração Geral)</SelectItem>
                <SelectItem value="custom">Customizada</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {cliente?.fonteTarifa === "custom" && (
          <>
            <div>
              <label htmlFor="tusd" className="block text-sm font-medium text-gray-700 mb-1">TUSD Customizado</label>
              {readOnly ? (
                <div className="p-2 bg-gray-50 border rounded-md">{cliente?.tusd?.toFixed(2) || "0.00"}</div>
              ) : (
                <Input
                  id="tusd"
                  type="number"
                  placeholder="0.00"
                  value={cliente?.tusd || 0}
                  onChange={(e) => onClienteChange({ ...cliente!, tusd: parseFloat(e.target.value) || 0 })}
                />
              )}
            </div>
            <div>
              <label htmlFor="te" className="block text-sm font-medium text-gray-700 mb-1">TE Customizado</label>
              {readOnly ? (
                <div className="p-2 bg-gray-50 border rounded-md">{cliente?.te?.toFixed(2) || "0.00"}</div>
              ) : (
                <Input
                  id="te"
                  type="number"
                  placeholder="0.00"
                  value={cliente?.te || 0}
                  onChange={(e) => onClienteChange({ ...cliente!, te: parseFloat(e.target.value) || 0 })}
                />
              )}
            </div>
          </>
        )}

        <div>
          <label htmlFor="iluminacao" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Iluminação Pública (Padrão Cliente)</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">{cliente?.tipoIluminacao === "fixo" ? "Valor Fixo (R$)" : "Percentual"}</div>
          ) : (
            <Select
              value={cliente?.tipoIluminacao || "fixo"}
              onValueChange={(value) => onClienteChange({ ...cliente!, tipoIluminacao: value })}
            >
              <SelectTrigger id="iluminacao">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                <SelectItem value="percentual">Percentual</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <label htmlFor="valorIluminacao" className="block text-sm font-medium text-gray-700 mb-1">
            {cliente?.tipoIluminacao === 'fixo' 
              ? 'Valor Fixo Iluminação (Padrão Cliente R$)' 
              : 'Valor percentual da tarifa TU + TE (%)'}
          </label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">
              {cliente?.tipoIluminacao === 'fixo' ? (cliente?.valorIluminacaoFixo?.toFixed(2) || "0.00") : (cliente?.valorIluminacaoPercentual || "0")}
            </div>
          ) : (
            <Input
              id="valorIluminacao"
              type="number"
              value={cliente?.tipoIluminacao === 'fixo' ? (cliente?.valorIluminacaoFixo || 0) : (cliente?.valorIluminacaoPercentual || 0)}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                if (cliente?.tipoIluminacao === 'fixo') {
                  onClienteChange({ ...cliente!, valorIluminacaoFixo: value });
                } else {
                  onClienteChange({ ...cliente!, valorIluminacaoPercentual: value });
                }
              }}
            />
          )}
        </div>
      </div>
      <div className="bg-green-50 border border-green-100 p-4 rounded-md">
        <div className="flex items-start gap-2">
          <div className="text-green-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-700">Explicação do Cálculo (Configuração Padrão Cliente)</h4>
            <p className="text-xs text-green-600 mt-1">
              O cliente terá um desconto nominal de {cliente?.percentualEconomia || 0}% sobre o valor de Tarifa de Uso (TU) e Tarifa de Energia (TE). A iluminação pública 
              padrão será calculada como um {cliente?.tipoIluminacao === 'fixo' ? `valor fixo de R$ ${cliente?.valorIluminacaoFixo?.toFixed(2) || '0.00'}` : `percentual de ${cliente?.valorIluminacaoPercentual || 0}%`}. A economia total considera o desconto nominal mais o valor da iluminação 
              que o cliente deixa de pagar. As tarifas (TU e TE) serão obtidas da configuração {cliente?.fonteTarifa === 'global' ? 'global do sistema' : 'customizada'}.
              {cliente?.fonteTarifa === 'custom' && ` (TUSD: ${cliente?.tusd?.toFixed(2) || '0.00'}, TE: ${cliente?.te?.toFixed(2) || '0.00'})`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para adicionar imóvel
const AdicionarImovelModal = ({
  isOpen,
  onClose,
  onSave,
  cliente,
  onClienteChange
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imovel: Imovel) => void;
  cliente: ClienteApp;
  onClienteChange: (clienteAtualizado: ClienteApp) => void;
}) => {
  const [novoImovel, setNovoImovel] = useState<Imovel>({
    apelido: '',
    codigo: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNovoImovel({
        apelido: '',
        codigo: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
      });
    }
  }, [isOpen]);

  const handleSaveImovel = async () => {
    if (!cliente.id) {
      toast({
        title: "Erro",
        description: "ID do cliente não disponível para salvar o imóvel.",
        variant: "destructive",
      });
      return;
    }

    const imoveisExistentes = Array.isArray(cliente.imoveis) ? cliente.imoveis : [];
    const imoveisAtualizados = [...imoveisExistentes, novoImovel];
    
    try {
      onClienteChange({ ...cliente, imoveis: imoveisAtualizados });
      await clienteService.update(cliente.id, { imoveis: imoveisAtualizados });
      toast({
        title: "Sucesso",
        description: "Imóvel adicionado com sucesso!",
      });
      onSave(novoImovel);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Imóvel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="apelido" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Apelido do Imóvel</label>
            <Input 
              id="apelido" 
              placeholder="Casa da Praia"
              value={novoImovel.apelido}
              onChange={(e) => setNovoImovel({ ...novoImovel, apelido: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="codigoConcessionaria" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Código da Concessionária</label>
            <Input 
              id="codigoConcessionaria" 
              placeholder="9001234567"
              value={novoImovel.codigo}
              onChange={(e) => setNovoImovel({ ...novoImovel, codigo: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="endereco" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Endereço Completo</label>
            <Input 
              id="endereco" 
              placeholder="Rua das Flores, 123"
              value={novoImovel.endereco}
              onChange={(e) => setNovoImovel({ ...novoImovel, endereco: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="cidade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cidade</label>
            <Input 
              id="cidade" 
              placeholder="São Paulo"
              value={novoImovel.cidade}
              onChange={(e) => setNovoImovel({ ...novoImovel, cidade: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="estado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Estado</label>
            <Input 
              id="estado" 
              placeholder="SP"
              value={novoImovel.estado}
              onChange={(e) => setNovoImovel({ ...novoImovel, estado: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="cep" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">CEP</label>
            <Input 
              id="cep" 
              placeholder="00000-000"
              value={novoImovel.cep}
              onChange={(e) => setNovoImovel({ ...novoImovel, cep: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveImovel}>Salvar Imóvel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Modal para editar imóvel
const EditarImovelModal = ({
  isOpen,
  onClose,
  imovel,
  onSave, 
  cliente,
  onClienteChange
}: {
  isOpen: boolean;
  onClose: () => void;
  imovel?: Imovel;
  onSave: (imovelAtualizado: Imovel) => void; 
  cliente: ClienteApp; 
  onClienteChange: (clienteAtualizado: ClienteApp) => void; 
}) => {
  const [editedImovel, setEditedImovel] = useState<Imovel | undefined>(imovel);
  const { toast } = useToast();

  useEffect(() => {
    setEditedImovel(imovel);
  }, [imovel]);

  const handleSaveChanges = async () => {
    if (!editedImovel || !imovel || !cliente.id) {
      toast({
        title: "Erro",
        description: "Dados do imóvel ou ID do cliente inválidos para salvar.",
        variant: "destructive",
      });
      return;
    }

    const imoveisExistentes = Array.isArray(cliente.imoveis) ? cliente.imoveis : [];
    const imovelIndex = imoveisExistentes.findIndex(i => i.apelido === imovel.apelido && i.codigo === imovel.codigo);

    if (imovelIndex !== undefined && imovelIndex !== -1) {
      const imoveisAtualizados = [...imoveisExistentes];
      imoveisAtualizados[imovelIndex] = editedImovel;
      
      try {
        onClienteChange({ ...cliente, imoveis: imoveisAtualizados });
        await clienteService.update(cliente.id, { imoveis: imoveisAtualizados });
        toast({
          title: "Sucesso",
          description: "Imóvel atualizado com sucesso!",
        });
        onSave(editedImovel); 
        onClose();
      } catch (error) {
        console.error("Erro ao salvar alterações do imóvel:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações do imóvel. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Imóvel não encontrado para atualização.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Imóvel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="editApelido" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Apelido do Imóvel</label>
            <Input
              id="editApelido"
              placeholder="Casa da Praia"
              value={editedImovel?.apelido || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, apelido: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="editCodigoConcessionaria" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Código da Concessionária</label>
            <Input
              id="editCodigoConcessionaria"
              placeholder="9001234567"
              value={editedImovel?.codigo || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, codigo: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="editEndereco" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Endereço Completo</label>
            <Input
              id="editEndereco"
              placeholder="Rua das Flores, 123"
              value={editedImovel?.endereco || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, endereco: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="editCidade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cidade</label>
            <Input
              id="editCidade"
              placeholder="São Paulo"
              value={editedImovel?.cidade || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, cidade: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="editEstado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Estado</label>
            <Input
              id="editEstado"
              placeholder="SP"
              value={editedImovel?.estado || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, estado: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="editCep" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">CEP</label>
            <Input
              id="editCep"
              placeholder="00000-000"
              value={editedImovel?.cep || ''}
              onChange={(e) => setEditedImovel({ ...editedImovel!, cep: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente para imóveis vinculados
const ImoveisForm = ({
  readOnly = false,
  cliente,
  onClienteChange
}: {
  readOnly?: boolean;
  cliente?: ClienteApp;
  onClienteChange: (clienteAtualizado: ClienteApp) => void;
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imovelParaEdicao, setImovelParaEdicao] = useState<Imovel | undefined>(undefined);

  const handleAddImovel = () => {
    // onClienteChange já está sendo chamado pelo AdicionarImovelModal agora
    // Nenhuma lógica adicional necessária aqui, apenas fechar o modal
  };

  const handleEditImovel = (imovel: Imovel) => {
    setImovelParaEdicao(imovel);
    setIsEditModalOpen(true);
  };

  const handleRemoverImovel = (index: number) => {
    if (!cliente || !cliente.imoveis || !cliente.id) return; // Adicionado cliente.id
    
    const imoveisAtualizados = cliente.imoveis.filter((_, i) => i !== index);
    
    // Chamar clienteService.update para persistir a remoção
    try {
      onClienteChange({ ...cliente, imoveis: imoveisAtualizados }); // Atualizar estado local
      clienteService.update(cliente.id, { imoveis: imoveisAtualizados }); // Persistir no DB
      // Não é necessário toast aqui, pois o modal principal já trata os toasts de salvamento
    } catch (error) {
      console.error("Erro ao remover imóvel:", error);
      // Aqui você pode adicionar um toast de erro se desejar
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {!readOnly && (
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddModalOpen(true)}>
          Adicionar Novo Imóvel
        </Button>
      )}

      {cliente?.imoveis && cliente.imoveis.length > 0 ? (
        <div className="border rounded-md">
          {cliente.imoveis.map((imovel, index) => (
            <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div>
                <p className="font-medium">{imovel.apelido}</p>
                <p className="text-sm text-gray-500">{imovel.endereco}</p>
                <p className="text-sm text-gray-500">Cód. Concessionária: {imovel.codigo}</p>
              </div>
              {!readOnly && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditImovel(imovel)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemoverImovel(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Nenhum imóvel vinculado.</p>
      )}

      <AdicionarImovelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImovel}
        cliente={cliente!} 
        onClienteChange={onClienteChange} 
      />

      {imovelParaEdicao && (
        <EditarImovelModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setImovelParaEdicao(undefined);
          }}
          imovel={imovelParaEdicao}
          onSave={() => { /* Vazio, pois a lógica de atualização está no modal */ }}
          cliente={cliente!} 
          onClienteChange={onClienteChange} 
        />
      )}
    </div>
  );
};

// Componente para o modal de edição ou visualização de cliente
const EditarClienteModal = ({
  isOpen,
  onClose,
  isViewOnly = false,
  clienteId
}: {
  isOpen: boolean;
  onClose: () => void;
  isViewOnly?: boolean;
  clienteId?: string;
}) => {
  const [activeTab, setActiveTab] = useState("pessoal");
  const { toast } = useToast();
  const [editedCliente, setEditedCliente] = useState<ClienteApp | undefined>(undefined);

  useEffect(() => {
    if (isOpen && clienteId) {
      const loadCliente = async () => {
        try {
          const cliente = await clienteService.getById(clienteId);
          if (cliente) {
            setEditedCliente(cliente);
          } else {
            toast({
              title: "Erro",
              description: "Cliente não encontrado.",
              variant: "destructive",
            });
            onClose();
          }
        } catch (error) {
          console.error("Erro ao carregar cliente:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do cliente.",
            variant: "destructive",
          });
          onClose();
        }
      };
      loadCliente();
    } else if (!isOpen) {
      setEditedCliente(undefined);
      setActiveTab("pessoal");
    }
  }, [isOpen, clienteId, toast, onClose]);

  const handleSaveChanges = async () => {
    if (!editedCliente || !editedCliente.id) {
      toast({
        title: "Erro",
        description: "Dados do cliente inválidos para salvar.",
        variant: "destructive",
      });
      return;
    }
    try {
      await clienteService.update(editedCliente.id, editedCliente);
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações do cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>{isViewOnly ? "Detalhes do Cliente" : "Editar Cliente"}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="informacoes">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="configuracao">Configuração de Cálculo</TabsTrigger>
            <TabsTrigger value="imoveis">Imóveis Vinculados</TabsTrigger>
          </TabsList>
          <TabsContent value="informacoes">
            {editedCliente ? (
              <InformacoesForm readOnly={isViewOnly} cliente={editedCliente} onClienteChange={setEditedCliente} />
            ) : (
              <div className="py-8 text-center">Carregando dados do cliente...</div>
            )}
          </TabsContent>
          <TabsContent value="configuracao">
            {editedCliente && (
              <ConfiguracaoForm readOnly={isViewOnly} cliente={editedCliente} onClienteChange={setEditedCliente} />
            )}
          </TabsContent>
          <TabsContent value="imoveis">
            {editedCliente && (
              <ImoveisForm 
                readOnly={isViewOnly} 
                cliente={editedCliente} 
                onClienteChange={(updatedClient) => {
                  if (updatedClient) {
                    setEditedCliente(updatedClient);
                  }
                }}
              />
            )}
          </TabsContent>
        </Tabs>
        {!isViewOnly && (
          <div className="flex justify-end gap-3 mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>
              Salvar Alterações
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditarClienteModal;


