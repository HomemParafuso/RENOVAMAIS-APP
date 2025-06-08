
import React, { useState, useEffect } from "react";
import GeradoraSidebar from "./GeradoraSidebar";
import GeradoraHeader from "./GeradoraHeader";

interface GeradoraLayoutProps {
  children: React.ReactNode;
}

export default function GeradoraLayout({ children }: GeradoraLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Monitorar mudanças no estado do sidebar
  useEffect(() => {
    const checkSidebarState = () => {
      const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      setSidebarCollapsed(collapsed);
    };

    // Verificar estado inicial
    checkSidebarState();

    // Configurar listener para mudanças no localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sidebarCollapsed') {
        setSidebarCollapsed(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Também verificar periodicamente para capturar mudanças feitas na mesma janela
    const interval = setInterval(checkSidebarState, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <GeradoraSidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0'}`}>
        <GeradoraHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
