
import React, { useState, useEffect } from "react";
import { clienteService, ClienteApp } from "@/services/clienteService";
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
const InformacoesForm = ({ readOnly = false, cliente }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.nome || ""}</div>
      ) : (
        <Input id="nome" defaultValue={cliente?.nome || ""} />
      )}
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.email || ""}</div>
      ) : (
        <Input id="email" type="email" defaultValue={cliente?.email || ""} />
      )}
    </div>
    <div>
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.cpf || ""}</div>
      ) : (
        <Input id="cpf" defaultValue={cliente?.cpf || ""} />
      )}
    </div>
    <div>
      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">{cliente?.telefone || ""}</div>
      ) : (
        <Input id="telefone" defaultValue={cliente?.telefone || ""} />
      )}
    </div>
    <div className="md:col-span-2">
      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Principal</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">Endereço de correspondência ou principal</div>
      ) : (
        <Input id="endereco" placeholder="Endereço de correspondência ou principal" />
      )}
    </div>
    <div>
      <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data de Adesão</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">dd / mm / aaaa</div>
      ) : (
        <Input id="data" placeholder="dd / mm / aaaa" />
      )}
    </div>
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">Ativo</div>
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
      {readOnly ? (
        <div className="p-2 bg-gray-50 border rounded-md">0</div>
      ) : (
        <Input id="potencia" type="number" defaultValue="0" />
      )}
    </div>
  </div>
);

// Componente para configuração de cálculo
const ConfiguracaoForm = ({ readOnly = false, cliente }) => {
  const [tipoCalculo, setTipoCalculo] = useState(cliente?.tipoCalculo || "percentual");
  const [fonteTarifa, setFonteTarifa] = useState(cliente?.fonteTarifa || "global");
  const [tipoIluminacao, setTipoIluminacao] = useState(cliente?.tipoIluminacao || "fixo");
  
  // Atualizar estados quando o cliente mudar
  useEffect(() => {
    if (cliente) {
      setTipoCalculo(cliente.tipoCalculo || "percentual");
      setFonteTarifa(cliente.fonteTarifa || "global");
      setTipoIluminacao(cliente.tipoIluminacao || "fixo");
    }
  }, [cliente]);

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">Percentual de Economia</div>
        ) : (
          <Select defaultValue="percentual" onValueChange={setTipoCalculo}>
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
            <div className="p-2 bg-gray-50 border rounded-md">10</div>
          ) : (
            <Input id="desconto" type="number" defaultValue="10" />
          )}
        </div>
        <div>
          <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-1">Fonte da Tarifa (TU e TE)</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">Global (Configuração Geral)</div>
          ) : (
            <Select defaultValue="global" onValueChange={setFonteTarifa}>
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

        {fonteTarifa === "custom" && (
          <>
            <div>
              <label htmlFor="tusd" className="block text-sm font-medium text-gray-700 mb-1">TUSD Customizado</label>
              {readOnly ? (
                <div className="p-2 bg-gray-50 border rounded-md">0.00</div>
              ) : (
                <Input id="tusd" type="number" placeholder="0.00" />
              )}
            </div>
            <div>
              <label htmlFor="te" className="block text-sm font-medium text-gray-700 mb-1">TE Customizado</label>
              {readOnly ? (
                <div className="p-2 bg-gray-50 border rounded-md">0.00</div>
              ) : (
                <Input id="te" type="number" placeholder="0.00" />
              )}
            </div>
          </>
        )}

        <div>
          <label htmlFor="iluminacao" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Iluminação Pública (Padrão Cliente)</label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">Valor Fixo (R$)</div>
          ) : (
            <Select defaultValue="fixo" onValueChange={setTipoIluminacao}>
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
            {tipoIluminacao === 'fixo' 
              ? 'Valor Fixo Iluminação (Padrão Cliente R$)' 
              : 'Valor percentual da tarifa TU + TE (%)'}
          </label>
          {readOnly ? (
            <div className="p-2 bg-gray-50 border rounded-md">0</div>
          ) : (
            <Input id="valorIluminacao" type="number" defaultValue="0" />
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
const AdicionarImovelModal = ({ isOpen, onClose, onSave, imoveis, setImoveis }) => {
  const handleSaveImovel = () => {
    // Coletar dados do formulário
    const apelido = (document.getElementById('apelido') as HTMLInputElement)?.value;
    const codigo = (document.getElementById('codigoConcessionaria') as HTMLInputElement)?.value;
    const endereco = (document.getElementById('endereco') as HTMLInputElement)?.value;
    const cidade = (document.getElementById('cidade') as HTMLInputElement)?.value;
    const estado = (document.getElementById('estado') as HTMLInputElement)?.value;
    const cep = (document.getElementById('cep') as HTMLInputElement)?.value;
    
    // Criar novo imóvel
    const enderecoCompleto = `${endereco}, ${cidade} - ${estado}, CEP ${cep}`;
    const novoImovel = {
      apelido: apelido || 'Novo Imóvel',
      codigo: codigo || '',
      endereco: enderecoCompleto
    };
    
    // Atualizar o estado
    const imoveisAtualizados = [...imoveis, novoImovel];
    setImoveis(imoveisAtualizados);
    
    // Chamar a função onSave para notificar o componente pai
    if (onSave) {
      onSave(imoveisAtualizados);
    }
    
    // Fechar o modal
    onClose();
  };
  
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
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveImovel}>
            Salvar Imóvel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para editar imóvel
const EditarImovelModal = ({ isOpen, onClose, imovel, onSave, imoveis, setImoveis }) => {
  const handleSaveChanges = () => {
    if (!imovel) return;
    
    // Coletar dados do formulário
    const apelido = (document.getElementById('apelido') as HTMLInputElement)?.value;
    const codigo = (document.getElementById('codigoConcessionaria') as HTMLInputElement)?.value;
    const endereco = (document.getElementById('endereco') as HTMLInputElement)?.value;
    
    // Atualizar o imóvel no array de imóveis
    const imoveisAtualizados = imoveis.map((item) => {
      if (item.apelido === imovel.apelido && item.codigo === imovel.codigo) {
        return { apelido, codigo, endereco };
      }
      return item;
    });
    
    // Atualizar o estado
    setImoveis(imoveisAtualizados);
    
    // Chamar a função onSave para notificar o componente pai
    if (onSave) {
      onSave(imoveisAtualizados);
    }
    
    // Fechar o modal
    onClose();
  };
  
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
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para imóveis vinculados
const ImoveisForm = ({ readOnly = false, cliente, onImoveisChange }) => {
  const [imoveis, setImoveis] = useState(
    cliente?.imoveis || [
      { apelido: 'CASA DE LAIANY', codigo: '7025079684', endereco: 'RUA MONSENHOR SEVERIANO, 38, CASA 8' }
    ]
  );
  
  // Atualizar imóveis quando o cliente mudar
  useEffect(() => {
    if (cliente?.imoveis) {
      setImoveis(cliente.imoveis);
    }
  }, [cliente]);
  
  // Notificar o componente pai sobre mudanças nos imóveis
  useEffect(() => {
    if (onImoveisChange) {
      onImoveisChange(imoveis);
    }
  }, [imoveis, onImoveisChange]);
  
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
        {!readOnly && (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="mr-2">+</span>
            Adicionar Imóvel
          </Button>
        )}
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
              {!readOnly && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
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
                {!readOnly && (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdicionarImovelModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImovel}
        imoveis={imoveis}
        setImoveis={setImoveis}
      />

      <EditarImovelModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        imovel={currentImovel}
        onSave={handleEditImovel}
        imoveis={imoveis}
        setImoveis={setImoveis}
      />
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
  const [cliente, setCliente] = useState<ClienteApp | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Carregar dados do cliente quando o modal for aberto
  useEffect(() => {
    if (isOpen && clienteId) {
      setLoading(true);
      clienteService.getById(clienteId)
        .then(data => {
          setCliente(data);
        })
        .catch(error => {
          console.error('Erro ao carregar cliente:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do cliente.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, clienteId]);

  const handleSaveChanges = async () => {
    if (!cliente) return;
    
    try {
      // Coletar dados do formulário - Informações Pessoais
      const nome = (document.getElementById('nome') as HTMLInputElement)?.value;
      const email = (document.getElementById('email') as HTMLInputElement)?.value;
      const cpf = (document.getElementById('cpf') as HTMLInputElement)?.value;
      const telefone = (document.getElementById('telefone') as HTMLInputElement)?.value;
      const endereco = (document.getElementById('endereco') as HTMLInputElement)?.value;
      const dataAdesao = (document.getElementById('data') as HTMLInputElement)?.value;
      
      // Coletar dados de Configuração de Cálculo
      const tipoCalculo = (document.querySelector('#tipo .select-value') as HTMLElement)?.textContent || cliente.tipoCalculo || 'percentual';
      const percentualEconomia = parseFloat((document.getElementById('desconto') as HTMLInputElement)?.value || '0');
      const fonteTarifa = (document.querySelector('#fonte .select-value') as HTMLElement)?.textContent || cliente.fonteTarifa || 'global';
      
      // Valores de TUSD e TE (se aplicável)
      let tusd = cliente.tusd || 0;
      let te = cliente.te || 0;
      
      if (fonteTarifa === 'custom') {
        tusd = parseFloat((document.getElementById('tusd') as HTMLInputElement)?.value || '0');
        te = parseFloat((document.getElementById('te') as HTMLInputElement)?.value || '0');
      }
      
      // Configurações de iluminação pública
      const tipoIluminacao = (document.querySelector('#iluminacao .select-value') as HTMLElement)?.textContent || cliente.tipoIluminacao || 'fixo';
      const valorIluminacao = parseFloat((document.getElementById('valorIluminacao') as HTMLInputElement)?.value || '0');
      
      // Preparar objeto com todos os dados atualizados
      const clienteAtualizado = {
        ...cliente,
        nome,
        email,
        cpf,
        telefone,
        endereco,
        dataAdesao,
        tipoCalculo,
        percentualEconomia,
        fonteTarifa,
        tusd,
        te,
        tipoIluminacao,
        valorIluminacaoFixo: tipoIluminacao === 'fixo' ? valorIluminacao : cliente.valorIluminacaoFixo || 0,
        valorIluminacaoPercentual: tipoIluminacao === 'percentual' ? valorIluminacao : cliente.valorIluminacaoPercentual || 0,
      };
      
      console.log('Salvando cliente atualizado:', clienteAtualizado);
      
      // Atualizar cliente no Firebase
      await clienteService.update(cliente.id, clienteAtualizado);
      
      // Atualizar o estado local para refletir as mudanças imediatamente
      setCliente(clienteAtualizado);
      
      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas com sucesso!",
      });
      
      // Recarregar a página para mostrar os dados atualizados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
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
            {loading ? (
              <div className="py-8 text-center">Carregando dados do cliente...</div>
            ) : (
              <InformacoesForm readOnly={isViewOnly} cliente={cliente} />
            )}
          </TabsContent>
          <TabsContent value="configuracao">
            <ConfiguracaoForm readOnly={isViewOnly} cliente={cliente} />
          </TabsContent>
          <TabsContent value="imoveis">
            <ImoveisForm 
              readOnly={isViewOnly} 
              cliente={cliente} 
              onImoveisChange={(imoveisAtualizados) => {
                if (cliente) {
                  setCliente({
                    ...cliente,
                    imoveis: imoveisAtualizados
                  });
                }
              }} 
            />
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
