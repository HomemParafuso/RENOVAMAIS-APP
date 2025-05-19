
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
const InformacoesForm = ({ readOnly = false }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
      <Input id="nome" defaultValue="Pablio Tacyanno" readOnly={readOnly} />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <Input id="email" type="email" readOnly={readOnly} />
    </div>
    <div>
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
      <Input id="cpf" readOnly={readOnly} />
    </div>
    <div>
      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
      <Input id="telefone" readOnly={readOnly} />
    </div>
    <div className="md:col-span-2">
      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Principal</label>
      <Input id="endereco" placeholder="Endereço de correspondência ou principal" readOnly={readOnly} />
    </div>
    <div>
      <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data de Adesão</label>
      <Input id="data" placeholder="dd / mm / aaaa" readOnly={readOnly} />
    </div>
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      {readOnly ? (
        <Input id="status" defaultValue="Ativo" readOnly={true} />
      ) : (
        <Select defaultValue="ativo">
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
      <Input id="potencia" type="number" defaultValue="0" readOnly={readOnly} />
    </div>
  </div>
);

// Componente para configuração de cálculo
const ConfiguracaoForm = () => {
  const [tipoCalculo, setTipoCalculo] = useState("percentual");
  const [fonteTarifa, setFonteTarifa] = useState("global");
  const [tipoIluminacao, setTipoIluminacao] = useState("fixo");

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
        <Select defaultValue="percentual" onValueChange={setTipoCalculo}>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo de cálculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentual">Percentual de Economia</SelectItem>
            <SelectItem value="nominal">Valor Nominal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="desconto" className="block text-sm font-medium text-gray-700 mb-1">Percentual de Desconto Nominal (s/ TU+TE)</label>
          <Input id="desconto" type="number" defaultValue="10" />
        </div>
        <div>
          <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-1">Fonte da Tarifa (TU e TE)</label>
          <Select defaultValue="global" onValueChange={setFonteTarifa}>
            <SelectTrigger id="fonte">
              <SelectValue placeholder="Selecione a fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global (Configuração Geral)</SelectItem>
              <SelectItem value="custom">Customizada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {fonteTarifa === "custom" && (
          <>
            <div>
              <label htmlFor="tusd" className="block text-sm font-medium text-gray-700 mb-1">TUSD Customizado</label>
              <Input id="tusd" type="number" placeholder="0.00" />
            </div>
            <div>
              <label htmlFor="te" className="block text-sm font-medium text-gray-700 mb-1">TE Customizado</label>
              <Input id="te" type="number" placeholder="0.00" />
            </div>
          </>
        )}

        <div>
          <label htmlFor="iluminacao" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Iluminação Pública (Padrão Cliente)</label>
          <Select defaultValue="fixo" onValueChange={setTipoIluminacao}>
            <SelectTrigger id="iluminacao">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
              <SelectItem value="percentual">Percentual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="valorIluminacao" className="block text-sm font-medium text-gray-700 mb-1">
            {tipoIluminacao === 'fixo' 
              ? 'Valor Fixo Iluminação (Padrão Cliente R$)' 
              : 'Valor percentual da tarifa TU + TE (%)'}
          </label>
          <Input id="valorIluminacao" type="number" defaultValue="0" />
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
              O cliente terá um desconto nominal de 10% sobre o valor de Tarifa de Uso (TU) e Tarifa de Energia (TE). A iluminação pública 
              padrão será calculada como um valor fixo de R$ 0,00. A economia total considera o desconto nominal mais o valor da iluminação 
              que o cliente deixa de pagar. As tarifas (TU e TE) serão obtidas da configuração global do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para adicionar imóvel
const AdicionarImovelModal = ({ isOpen, onClose, onSave }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="apelido" className="block text-sm font-medium text-gray-700 mb-1">Apelido do Imóvel</label>
            <Input id="apelido" placeholder="Ex: Casa Principal, Apartamento, etc." />
          </div>
          <div>
            <label htmlFor="codigoConcessionaria" className="block text-sm font-medium text-gray-700 mb-1 font-bold">Código da Concessionária</label>
            <Input id="codigoConcessionaria" placeholder="Insira o código da concessionária" />
          </div>
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
            <Input id="endereco" placeholder="Rua, número, complemento, bairro" />
          </div>
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <Input id="cidade" placeholder="Cidade" />
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <Input id="estado" placeholder="Estado" />
          </div>
          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <Input id="cep" placeholder="CEP" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
            onSave();
            onClose();
          }}>Salvar Imóvel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para editar imóvel
const EditarImovelModal = ({ isOpen, onClose, imovel, onSave }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Imóvel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="apelido" className="block text-sm font-medium text-gray-700 mb-1">Apelido do Imóvel</label>
            <Input id="apelido" defaultValue={imovel?.apelido} />
          </div>
          <div>
            <label htmlFor="codigoConcessionaria" className="block text-sm font-medium text-gray-700 mb-1 font-bold">Código da Concessionária</label>
            <Input id="codigoConcessionaria" defaultValue={imovel?.codigo} />
          </div>
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
            <Input id="endereco" defaultValue={imovel?.endereco} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
            onSave();
            onClose();
          }}>Salvar Alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para imóveis vinculados
const ImoveisForm = () => {
  const [imoveis, setImoveis] = useState([
    { apelido: 'CASA DE LAIANY', codigo: '7025079684', endereco: 'RUA MONSENHOR SEVERIANO, 38, CASA 8' }
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentImovel, setCurrentImovel] = useState(null);
  const { toast } = useToast();

  const handleAddImovel = () => {
    const newImovel = {
      apelido: 'NOVO IMÓVEL',
      codigo: '1234567890',
      endereco: 'ENDEREÇO DO NOVO IMÓVEL'
    };
    
    setImoveis([...imoveis, newImovel]);
    
    toast({
      title: "Imóvel adicionado",
      description: "O imóvel foi adicionado com sucesso!",
    });
  };

  const handleEditImovel = () => {
    // Em um caso real, seria feita uma atualização no array de imóveis
    toast({
      title: "Imóvel atualizado",
      description: "As informações do imóvel foram atualizadas com sucesso!",
    });
  };

  const handleRemoverImovel = (index) => {
    const novosImoveis = [...imoveis];
    novosImoveis.splice(index, 1);
    setImoveis(novosImoveis);
    
    toast({
      title: "Imóvel removido",
      description: "O imóvel foi removido com sucesso!",
      variant: "destructive",
    });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Imóveis Vinculados ao Cliente</h3>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="mr-2">+</span>
          Adicionar Imóvel
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apelido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                Cód. Concessionária
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {imoveis.map((imovel, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {imovel.apelido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                  {imovel.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {imovel.endereco}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setCurrentImovel(imovel);
                        setIsEditModalOpen(true);
                      }}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoverImovel(index)} className="text-red-600">
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdicionarImovelModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImovel}
      />

      <EditarImovelModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        imovel={currentImovel}
        onSave={handleEditImovel}
      />
    </div>
  );
};

// Componente para o modal de edição ou visualização de cliente
const EditarClienteModal = ({ isOpen, onClose, isViewOnly = false }: { isOpen: boolean; onClose: () => void; isViewOnly?: boolean }) => {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Alterações salvas",
      description: "As alterações foram salvas com sucesso!",
    });
    onClose();
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
            {!isViewOnly && <TabsTrigger value="configuracao">Configuração de Cálculo</TabsTrigger>}
            <TabsTrigger value="imoveis">Imóveis Vinculados</TabsTrigger>
          </TabsList>
          <TabsContent value="informacoes">
            <InformacoesForm readOnly={isViewOnly} />
          </TabsContent>
          {!isViewOnly && (
            <TabsContent value="configuracao">
              <ConfiguracaoForm />
            </TabsContent>
          )}
          <TabsContent value="imoveis">
            <ImoveisForm />
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
