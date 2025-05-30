
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  Shield,
  BarChart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AdminSidebar = ({ collapsed = false, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Geradoras', path: '/admin/geradoras' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: CreditCard, label: 'Cobrança', path: '/admin/cobranca' },
    { icon: BarChart, label: 'Relatórios', path: '/admin/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-full transition-all duration-300`}>
      <div className="p-6 border-b">
        <div 
          className={`flex items-center ${collapsed ? 'justify-center' : ''} cursor-pointer`}
          onClick={onToggle}
        >
          <Shield className={`h-8 w-8 text-blue-600 ${collapsed ? 'mr-0' : 'mr-3'}`} />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Sistema de Gestão</p>
            </div>
          )}
          {!collapsed && (
            <ChevronLeft className="h-5 w-5 ml-auto text-gray-400" />
          )}
          {collapsed && (
            <ChevronRight className="h-5 w-5 mt-2 text-gray-400" />
          )}
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'px-6'} py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
