import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, User, Building, Calendar, CreditCard, Users } from "lucide-react";
import { Geradora } from '@/portal-admin/types';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para os dados adicionais que podem ser passados para o modal
interface GeradoraDetalhesAdicionais {
  latitude?: number;
  longitude?: number;
}

const DetalhesGeradoraModal = ({
  isOpen,
  onClose,
  geradora,
}: {
  isOpen: boolean;
  onClose: () => void;
  geradora?: Geradora;
  detalhesAdicionais?: GeradoraDetalhesAdicionais;
}) => {

  // Formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não informada";
    try {
      return format(new Date(dataString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  // Renderizar badge de status
  const renderizarStatus = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'bloqueado':
        return <Badge variant="destructive">Bloqueado</Badge>;
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Geradora</DialogTitle>
        </DialogHeader>

        {geradora ? (
          <div className="space-y-6 mt-4">
            {/* Cabeçalho com nome e status */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">{geradora.nome}</h2>
              </div>
              <div>
                {renderizarStatus(geradora.status)}
              </div>
            </div>

            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna 1: Dados da geradora */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Dados da Geradora</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base">{geradora.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">CNPJ</p>
                      <p className="text-base">{geradora.cnpj || "Não informado"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Endereço</p>
                      <p className="text-base">{geradora.endereco || "Não informado"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data de Cadastro</p>
                      <p className="text-base">{formatarData(geradora.dataCadastro)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Usuários Ativos</p>
                      <p className="text-base">{geradora.usuariosAtivos} de {geradora.limiteUsuarios}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Dados do Responsável e Plano de Cobrança */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Dados do Responsável</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p className="text-base">{geradora.responsavel || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-base">{geradora.telefone || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold border-b pb-2 mt-6">Plano de Cobrança</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo de Plano</p>
                      <p className="text-base">{geradora.planoCobranca?.tipo || "Não informado"}</p>
                    </div>
                  </div>
                  {geradora.planoCobranca?.percentual && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Percentual</p>
                        <p className="text-base">{geradora.planoCobranca.percentual}%</p>
                      </div>
                    </div>
                  )}
                  {geradora.planoCobranca?.valorFixo && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valor Fixo</p>
                        <p className="text-base">R$ {geradora.planoCobranca.valorFixo.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                  {geradora.planoCobranca?.valorPorUsuario && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valor por Usuário</p>
                        <p className="text-base">R$ {geradora.planoCobranca.valorPorUsuario.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Antigo espaço do mapa - agora apenas texto do endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Localização</h3>
              <p className="text-base">{geradora.endereco || "Endereço não informado."}</p>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Nenhum detalhe de geradora disponível.</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesGeradoraModal; 