
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LogOut, User } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAdminAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Painel Administrativo</h2>
          <p className="text-sm text-gray-500">Gestão completa do sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {user?.email}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
