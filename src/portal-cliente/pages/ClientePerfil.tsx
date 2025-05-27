
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MapPin, Phone, Mail, Building, Calendar } from "lucide-react";

const ClientePerfil = () => {
  const [dadosCliente] = useState({
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    dataContrato: "15/01/2024",
    geradora: "Usina Solar São Paulo I",
    potenciaContratada: "5 kWp"
  });

  const [contratoInfo] = useState({
    numero: "CNT-2024-001",
    dataInicio: "15/01/2024",
    status: "Ativo",
    modalidade: "Energia Solar",
    desconto: "10%",
    vigencia: "20 anos"
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Visualize suas informações pessoais e contratuais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <Input value={dadosCliente.nome} disabled className="mt-1" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <Input value={dadosCliente.cpf} disabled className="mt-1" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">E-mail</label>
              <div className="flex items-center mt-1">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <Input value={dadosCliente.email} disabled className="flex-1" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <div className="flex items-center mt-1">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <Input value={dadosCliente.telefone} disabled className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço</label>
              <Input value={dadosCliente.endereco} disabled className="mt-1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Cidade</label>
                <Input value={dadosCliente.cidade} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <Input value={dadosCliente.estado} disabled className="mt-1" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">CEP</label>
              <Input value={dadosCliente.cep} disabled className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Informações do Contrato */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Informações do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número do Contrato</label>
                  <p className="text-lg font-semibold mt-1">{contratoInfo.numero}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {contratoInfo.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="font-medium">{contratoInfo.dataInicio}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Modalidade</label>
                  <p className="font-medium mt-1">{contratoInfo.modalidade}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Geradora Vinculada</label>
                  <p className="font-medium mt-1">{dadosCliente.geradora}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Potência Contratada</label>
                  <p className="font-medium mt-1">{dadosCliente.potenciaContratada}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Desconto Aplicado</label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{contratoInfo.desconto}</p>
                  <p className="text-sm text-gray-500">sobre tarifa convencional</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Vigência do Contrato</label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{contratoInfo.vigencia}</p>
                  <p className="text-sm text-gray-500">a partir da data de início</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Solicitação de Alterações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Precisa atualizar seus dados?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Para solicitar alterações em seus dados pessoais ou contratuais, 
                      entre em contato conosco através dos canais de atendimento.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Solicitar Alteração
                      </Button>
                      <Button size="sm" variant="outline">
                        Fale Conosco
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientePerfil;
