
import React from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClienteHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem('clienteLogado');
    window.location.href = '/';
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Bem-vindo ao seu Portal de Energia Solar
          </h2>
          <p className="text-sm text-gray-500">
            Acompanhe seu consumo, economia e faturas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClienteHeader;
