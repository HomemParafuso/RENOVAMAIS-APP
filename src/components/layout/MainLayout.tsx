import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Toaster } from 'sonner';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const { notifications } = useNotification();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 font-bold">Renova Mais Energia</div>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {user && (
              <>
                <a href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </a>
                <a href="/faturas" className="text-sm font-medium transition-colors hover:text-primary">
                  Faturas
                </a>
                {user.role === 'admin' && (
                  <a href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin
                  </a>
                )}
              </>
            )}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={() => user.logout()}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sair
                </button>
              </div>
            ) : (
              <a href="/login" className="text-sm font-medium transition-colors hover:text-primary">
                Entrar
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6 px-4">
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  );
} 