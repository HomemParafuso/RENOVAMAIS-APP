
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Search, RefreshCw, Eye, Edit, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Componente para o formulário de informações pessoais
const InformacoesForm = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
      <Input id="nome" defaultValue="Pablio Tacyanno" />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <Input id="email" type="email" />
    </div>
    <div>
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
      <Input id="cpf" />
    </div>
    <div>
      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
      <Input id="telefone" />
    </div>
    <div className="md:col-span-2">
      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Principal</label>
      <Input id="endereco" placeholder="Endereço de correspondência ou principal" />
    </div>
    <div>
      <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data de Adesão</label>
      <Input id="data" placeholder="dd / mm / aaaa" />
    </div>
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
    </div>
    <div className="md:col-span-2">
      <label htmlFor="potencia" className="block text-sm font-medium text-gray-700 mb-1">Potência Contratada Total (kWp)</label>
      <Input id="potencia" type="number" defaultValue="0" />
    </div>
  </div>
);

// Componente para configuração de cálculo
const ConfiguracaoForm = () => (
  <div className="space-y-4 mt-4">
    <div>
      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
      <Select defaultValue="percentual">
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
        <Select defaultValue="global">
          <SelectTrigger id="fonte">
            <SelectValue placeholder="Selecione a fonte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global (Configuração Geral)</SelectItem>
            <SelectItem value="custom">Customizada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="iluminacao" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Iluminação Pública (Padrão Cliente)</label>
        <Select defaultValue="fixo">
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
        <label htmlFor="valorFixo" className="block text-sm font-medium text-gray-700 mb-1">Valor Fixo Iluminação (Padrão Cliente R$)</label>
        <Input id="valorFixo" type="number" defaultValue="0" />
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
            padrão será calculada como um valor fixo de R$ 0,00.A economia total considera o desconto nominal mais o valor da iluminação 
            que o cliente deixa de pagar. As tarifas (TU e TE) serão obtidas da configuração global do sistema.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Componente para imóveis vinculados
const ImoveisForm = () => {
  const imoveis = [
    { apelido: 'CASA DE LAIANY', codigo: '7025079684', endereco: 'RUA MONSENHOR SEVERIANO, 38, CASA 8' }
  ];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Imóveis Vinculados ao Cliente</h3>
        <Button className="bg-green-600 hover:bg-green-700">
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {imovel.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {imovel.endereco}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para o modal de edição de cliente
const EditarClienteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="informacoes">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="configuracao">Configuração de Cálculo</TabsTrigger>
            <TabsTrigger value="imoveis">Imóveis Vinculados</TabsTrigger>
          </TabsList>
          <TabsContent value="informacoes">
            <InformacoesForm />
          </TabsContent>
          <TabsContent value="configuracao">
            <ConfiguracaoForm />
          </TabsContent>
          <TabsContent value="imoveis">
            <ImoveisForm />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700">Salvar Alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClientesPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const clientes = [
    {
      id: 1,
      nome: "Pablio Tacyanno",
      cpf: "",
      tipoCalculo: "Percentual de Economia",
      status: "Ativo"
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os clientes da sua usina solar</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
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
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-5 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Nome</div>
          <div>CPF/CNPJ</div>
          <div>Tipo de Cálculo</div>
          <div>Status</div>
          <div className="text-right">Ações</div>
        </div>
        
        {clientes.map((cliente) => (
          <div key={cliente.id} className="grid grid-cols-5 px-6 py-4 border-b last:border-0 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium mr-3">
                {cliente.nome.charAt(0)}
              </div>
              <span className="font-medium">{cliente.nome}</span>
            </div>
            <div>{cliente.cpf || '-'}</div>
            <div>{cliente.tipoCalculo}</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {cliente.status}
              </span>
            </div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Convite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <EditarClienteModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ClientesPage;
