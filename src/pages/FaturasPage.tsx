
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, MoreVertical, Eye, Edit, Bell, Download, QrCode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FaturasPage = () => {
  const faturas = [
    {
      id: 1,
      cliente: "Cliente não encontrado",
      referencia: "",
      vencimento: "Não definido",
      valor: "R$ 0,00",
      status: "Pendente",
      notificado: false
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Faturas</h1>
          <p className="text-muted-foreground">Gerencie todas as faturas da sua usina solar</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <span className="mr-2">+</span>
          Nova Fatura
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por cliente ou referência"
            className="pl-10"
          />
        </div>
        <Select defaultValue="todos-status">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos-status">Todos os Status</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="todos-clientes">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos-clientes">Todos os Clientes</SelectItem>
            <SelectItem value="pablio">Pablio Tacyanno</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <div className="grid grid-cols-7 px-6 py-3 border-b text-sm font-medium text-gray-500">
          <div>Cliente</div>
          <div>Referência</div>
          <div>Vencimento</div>
          <div>Valor</div>
          <div>Status</div>
          <div>Notificado</div>
          <div className="text-right">Ações</div>
        </div>
        
        {faturas.map((fatura) => (
          <div key={fatura.id} className="grid grid-cols-7 px-6 py-4 border-b last:border-0 items-center">
            <div>{fatura.cliente}</div>
            <div>{fatura.referencia || '-'}</div>
            <div>{fatura.vencimento}</div>
            <div>{fatura.valor}</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {fatura.status}
              </span>
            </div>
            <div className="text-red-500">
              {fatura.notificado ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span>✕</span>
              )}
            </div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    Notificar Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Fatura
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaturasPage;
