
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const NovoClienteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [tipoCalculo, setTipoCalculo] = useState("percentual");
  const [fonteTarifa, setFonteTarifa] = useState("global");
  const [tipoIluminacao, setTipoIluminacao] = useState("fixo");
  const [activeTab, setActiveTab] = useState("informacoes");
  const { toast } = useToast();

  const handleSalvar = () => {
    toast({
      title: "Cliente criado",
      description: "O cliente foi cadastrado com sucesso!",
    });
    onClose();
  };

  const handleEnviarConvite = () => {
    toast({
      title: "Convite enviado",
      description: "Um e-mail de convite foi enviado para o cliente!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="informacoes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value="imoveis">
              Imóveis Vinculados
            </TabsTrigger>
            <TabsTrigger value="acesso">
              Liberação de Acesso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informacoes" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Nome do cliente" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input id="cpfCnpj" placeholder="CPF ou CNPJ" />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <h4 className="font-medium mb-3">Configuração de Cálculo</h4>
              
              <div className="mb-4">
                <Label htmlFor="tipoCalculo" className="mb-2 block">Tipo de Cálculo</Label>
                <Select value={tipoCalculo} onValueChange={setTipoCalculo}>
                  <SelectTrigger id="tipoCalculo">
                    <SelectValue placeholder="Selecione o tipo de cálculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual de Economia</SelectItem>
                    <SelectItem value="fixo">Valor Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoCalculo === "percentual" && (
                <div className="mb-4">
                  <Label htmlFor="percentualEconomia" className="mb-2 block">Percentual de Economia (%)</Label>
                  <Input id="percentualEconomia" type="number" placeholder="10" />
                </div>
              )}
              
              <div className="mb-4">
                <Label htmlFor="fonteTarifa" className="mb-2 block">Fonte da Tarifa (TU e TE)</Label>
                <Select value={fonteTarifa} onValueChange={setFonteTarifa}>
                  <SelectTrigger id="fonteTarifa">
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="customizada">Customizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fonteTarifa === "customizada" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="tusd" className="mb-2 block">TUSD (R$)</Label>
                    <Input id="tusd" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="te" className="mb-2 block">TE (R$)</Label>
                    <Input id="te" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label>Tipo de Iluminação Pública</Label>
                <RadioGroup value={tipoIluminacao} onValueChange={setTipoIluminacao} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixo" id="fixo" />
                    <Label htmlFor="fixo">Valor Fixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentual" id="percentual" />
                    <Label htmlFor="percentual">Percentual da Tarifa</Label>
                  </div>
                </RadioGroup>
              </div>

              {tipoIluminacao === "fixo" ? (
                <div className="mt-4">
                  <Label htmlFor="valorFixo" className="mb-2 block">Valor Fixo Iluminação (R$)</Label>
                  <Input id="valorFixo" type="number" step="0.01" placeholder="0.00" />
                </div>
              ) : (
                <div className="mt-4">
                  <Label htmlFor="valorPercentual" className="mb-2 block">Valor Percentual da Tarifa TU+TE (%)</Label>
                  <Input id="valorPercentual" type="number" step="0.01" placeholder="0" />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="imoveis" className="pt-4">
            <div className="mb-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <span className="mr-2">+</span>
                Adicionar Imóvel
              </Button>
            </div>

            <div className="bg-white rounded-md border">
              <div className="grid grid-cols-4 px-6 py-3 border-b text-sm font-medium text-gray-500">
                <div>Endereço</div>
                <div>Código Concessionária</div>
                <div>Distribuidora</div>
                <div className="text-right">Ações</div>
              </div>

              <div className="text-center py-6 text-gray-500">
                Nenhum imóvel vinculado a este cliente.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="acesso" className="space-y-4 pt-4">
            <p className="text-sm text-gray-600">
              O cliente receberá um e-mail com instruções para acessar o sistema. No primeiro acesso, ele precisará cadastrar uma senha.
            </p>

            <div>
              <Label htmlFor="emailAcesso">E-mail para Acesso</Label>
              <Input id="emailAcesso" type="email" placeholder="email@exemplo.com" className="mt-1" />
            </div>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 mt-2" 
              onClick={handleEnviarConvite}
            >
              Enviar Convite de Acesso
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalvar}>
            Salvar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoClienteModal;
