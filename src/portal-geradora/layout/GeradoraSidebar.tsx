import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, BarChart, Settings, Zap, CreditCard, Sun } from "lucide-react";

// Componente de item do sidebar que se adapta ao estado colapsado
const SidebarItem = ({ 
  to, 
  icon: Icon, 
  active, 
  children, 
  collapsed 
}: { 
  to: string; 
  icon: React.ElementType; 
  active: boolean; 
  children: React.ReactNode;
  collapsed: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-sm transition-colors ${
      active ? "bg-green-100 text-green-600" : "text-gray-600 hover:bg-green-50"
    } rounded-lg ${collapsed ? "justify-center" : ""}`}
    title={collapsed ? String(children) : ""}
  >
    <Icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
    {!collapsed && <span>{children}</span>}
  </Link>
);

export default function GeradoraSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [nomeEmpresa, setNomeEmpresa] = useState("Rennova Mais");
  const [collapsed, setCollapsed] = useState(false);

  // Alternar o estado do sidebar (expandido/recolhido)
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Salvar preferência do usuário no localStorage
    localStorage.setItem('sidebarCollapsed', String(!collapsed));
  };

  useEffect(() => {
    // Carregar preferência do usuário para o estado do sidebar
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === 'true');
    }

    // Carregar nome da empresa das configurações
    const configGeral = localStorage.getItem('configGeral');
    if (configGeral) {
      try {
        const config = JSON.parse(configGeral);
        if (config.nomeEmpresa) {
          setNomeEmpresa(config.nomeEmpresa);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
  }, []);

  // Atualizar quando as configurações mudarem
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'configGeral') {
        try {
          const config = JSON.parse(event.newValue || '{}');
          if (config.nomeEmpresa) {
            setNomeEmpresa(config.nomeEmpresa);
          }
        } catch (error) {
          console.error("Erro ao processar alterações de configuração:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} bg-white border-r border-gray-100 h-screen flex flex-col transition-all duration-300`}>
      <div className="p-4 border-b border-gray-100">
        <button 
          onClick={toggleSidebar} 
          className="flex items-center w-full focus:outline-none"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <div className="text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          {!collapsed && (
            <h1 className="ml-2 text-xl font-semibold text-blue-600 truncate">{nomeEmpresa}</h1>
          )}
        </button>
      </div>
      <div className="flex-1 py-4 space-y-1 px-2">
        <SidebarItem to="/geradora" icon={LayoutDashboard} active={currentPath === "/geradora"} collapsed={collapsed}>
          Dashboard
        </SidebarItem>
        <SidebarItem to="/geradora/clientes" icon={Users} active={currentPath.startsWith("/geradora/clientes")} collapsed={collapsed}>
          Clientes
        </SidebarItem>
        <SidebarItem to="/geradora/usinas" icon={Sun} active={currentPath.startsWith("/geradora/usinas")} collapsed={collapsed}>
          Usinas
        </SidebarItem>
        <SidebarItem to="/geradora/faturas" icon={FileText} active={currentPath.startsWith("/geradora/faturas")} collapsed={collapsed}>
          Faturas
        </SidebarItem>
        <SidebarItem to="/geradora/recebimentos" icon={CreditCard} active={currentPath.startsWith("/geradora/recebimentos")} collapsed={collapsed}>
          Recebimentos
        </SidebarItem>
        <SidebarItem to="/relatorios" icon={BarChart} active={currentPath.startsWith("/relatorios")} collapsed={collapsed}>
          Relatórios
        </SidebarItem>
        <SidebarItem to="/geradora/configuracoes" icon={Settings} active={currentPath.startsWith("/geradora/configuracoes")} collapsed={collapsed}>
          Configurações
        </SidebarItem>
      </div>
    </div>
  );
}
