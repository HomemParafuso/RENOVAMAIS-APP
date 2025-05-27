
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, BarChart, Bell, Download, User, CreditCard } from "lucide-react";

const SidebarItem = ({ to, icon: Icon, active, children }: { to: string; icon: React.ElementType; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-sm transition-colors ${
      active ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-blue-50"
    } rounded-lg`}
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{children}</span>
  </Link>
);

const ClienteSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [nomeCliente, setNomeCliente] = useState("João Silva");

  useEffect(() => {
    // Carregar dados do cliente logado
    const clienteLogado = localStorage.getItem('clienteLogado');
    if (clienteLogado) {
      const cliente = JSON.parse(clienteLogado);
      if (cliente.nome) {
        setNomeCliente(cliente.nome);
      }
    }
  }, []);

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <Link to="/cliente" className="flex items-center">
          <div className="mr-2 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-blue-600">Portal Cliente</h1>
            <p className="text-xs text-gray-500">{nomeCliente}</p>
          </div>
        </Link>
      </div>
      <div className="flex-1 py-4 space-y-1 px-2">
        <SidebarItem to="/cliente" icon={LayoutDashboard} active={currentPath === "/cliente"}>
          Dashboard
        </SidebarItem>
        <SidebarItem to="/cliente/faturas" icon={FileText} active={currentPath.startsWith("/cliente/faturas")}>
          Minhas Faturas
        </SidebarItem>
        <SidebarItem to="/cliente/consumo" icon={BarChart} active={currentPath.startsWith("/cliente/consumo")}>
          Consumo & Economia
        </SidebarItem>
        <SidebarItem to="/cliente/pagamentos" icon={CreditCard} active={currentPath.startsWith("/cliente/pagamentos")}>
          Pagamentos
        </SidebarItem>
        <SidebarItem to="/cliente/notificacoes" icon={Bell} active={currentPath.startsWith("/cliente/notificacoes")}>
          Notificações
        </SidebarItem>
        <SidebarItem to="/cliente/perfil" icon={User} active={currentPath.startsWith("/cliente/perfil")}>
          Meu Perfil
        </SidebarItem>
      </div>
      <div className="p-4 border-t border-gray-100">
        <Link 
          to="/" 
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Voltar ao sistema
        </Link>
      </div>
    </div>
  );
};

export default ClienteSidebar;
