
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, BarChart, Settings, Zap, CreditCard } from "lucide-react";

const SidebarItem = ({ to, icon: Icon, active, children }: { to: string; icon: React.ElementType; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-sm transition-colors ${
      active ? "bg-green-100 text-green-600" : "text-gray-600 hover:bg-green-50"
    } rounded-lg`}
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{children}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [nomeEmpresa, setNomeEmpresa] = useState("Renova Mais Energia");

  useEffect(() => {
    // Carregar nome da empresa das configurações
    const configGeral = localStorage.getItem('configGeral');
    if (configGeral) {
      const config = JSON.parse(configGeral);
      if (config.nomeEmpresa) {
        setNomeEmpresa(config.nomeEmpresa);
      }
    }
  }, []);

  // Atualizar quando as configurações mudarem
  useEffect(() => {
    const handleStorageChange = () => {
      const configGeral = localStorage.getItem('configGeral');
      if (configGeral) {
        const config = JSON.parse(configGeral);
        if (config.nomeEmpresa) {
          setNomeEmpresa(config.nomeEmpresa);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="w-56 bg-white border-r border-gray-100 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <Link to="/" className="flex items-center">
          <div className="mr-2 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-blue-600">{nomeEmpresa}</h1>
        </Link>
      </div>
      <div className="flex-1 py-4 space-y-1 px-2">
        <SidebarItem to="/" icon={LayoutDashboard} active={currentPath === "/"}>
          Dashboard
        </SidebarItem>
        <SidebarItem to="/clientes" icon={Users} active={currentPath.startsWith("/clientes")}>
          Clientes
        </SidebarItem>
        <SidebarItem to="/geradoras" icon={Zap} active={currentPath.startsWith("/geradoras")}>
          Geradoras
        </SidebarItem>
        <SidebarItem to="/faturas" icon={FileText} active={currentPath.startsWith("/faturas")}>
          Faturas
        </SidebarItem>
        <SidebarItem to="/recebimentos" icon={CreditCard} active={currentPath.startsWith("/recebimentos")}>
          Recebimentos
        </SidebarItem>
        <SidebarItem to="/relatorios" icon={BarChart} active={currentPath.startsWith("/relatorios")}>
          Relatórios
        </SidebarItem>
        <SidebarItem to="/configuracoes" icon={Settings} active={currentPath.startsWith("/configuracoes")}>
          Configurações
        </SidebarItem>
      </div>
    </div>
  );
};

export default Sidebar;
