import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { InvoiceProvider } from '@/context/InvoiceContext';
import { GeradoraProvider } from '@/context/GeradoraContext';
import { ClienteProvider } from '@/context/ClienteContext';
import { GeradoraAuthProvider, useGeradoraAuth } from '@/context/GeradoraAuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import GeradoraLayout from '@/portal-geradora/layout/GeradoraLayout';
import AdminLayout from '@/portal-admin/layout/AdminLayout';
import ClienteLayout from '@/portal-cliente/layout/ClienteLayout';
import { AdminAuthProvider } from '@/portal-admin/context/AdminAuthContext';
import { UsinaProvider } from '@/context/UsinaContext';

// Páginas do Portal da Geradora
import GeradoraDashboard from '@/portal-geradora/pages/Dashboard';
import GeradoraClientes from '@/portal-geradora/pages/Clientes';
import GeradoraGeradoras from '@/portal-geradora/pages/Geradoras';
import GeradoraFaturas from '@/portal-geradora/pages/Faturas';
import GeradoraFinanceiro from '@/portal-geradora/pages/Financeiro';
import GeradoraRecebimentos from '@/portal-geradora/pages/Recebimentos';
import GeradoraRelatorios from '@/portal-geradora/pages/Relatorios';
import GeradoraConfiguracoes from '@/portal-geradora/pages/Configuracoes';
import GeradoraProducao from '@/portal-geradora/pages/Producao';
import GeradoraUsinas from '@/portal-geradora/pages/UsinasPage';

// Páginas do Portal do Admin
import AdminDashboard from '@/portal-admin/pages/AdminDashboard';
import AdminClientes from '@/portal-admin/pages/AdminClientes';
import AdminGeradoras from '@/portal-admin/pages/AdminGeradoras';
import AdminCobranca from '@/portal-admin/pages/AdminCobranca';
import AdminRelatorios from '@/portal-admin/pages/AdminRelatorios';
import AdminConfiguracoes from '@/portal-admin/pages/AdminConfiguracoes';

// Páginas do Portal do Cliente
import ClienteDashboard from '@/portal-cliente/pages/ClienteDashboard';
import ClienteFaturas from '@/portal-cliente/pages/ClienteFaturas';
import ClientePagamentos from '@/portal-cliente/pages/ClientePagamentos';
import ClienteConsumo from '@/portal-cliente/pages/ClienteConsumo';
import ClienteNotificacoes from '@/portal-cliente/pages/ClienteNotificacoes';
import ClientePerfil from '@/portal-cliente/pages/ClientePerfil';

// Outras páginas
import { Login } from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { Invoices } from '@/pages/Invoices';
import { Admin } from '@/pages/Admin';

// Componente para proteger rotas
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'geradora' | 'client' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Enquanto estiver carregando, não faz nada
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificação especial para o admin fixo
  if (requiredRole === 'admin' && user.email !== 'pabllo.tca@gmail.com' && user.role !== 'admin') {
    console.log('Usuário não é admin:', user);
    return <Navigate to="/" replace />;
  }

  // Verificação para outros papéis
  if (requiredRole && user.role !== requiredRole) {
    console.log(`Usuário não é ${requiredRole}:`, user);
    
    // Redirecionar para o dashboard apropriado com base no papel do usuário
    if (user.role === 'admin' || user.email === 'pabllo.tca@gmail.com') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'geradora') {
      return <Navigate to="/geradora" replace />;
    } else if (user.role === 'client') {
      return <Navigate to="/cliente" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Componente para redirecionar usuários já autenticados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Enquanto estiver carregando, não faz nada
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se já estiver autenticado, redireciona para o dashboard apropriado
  if (user) {
    console.log('Usuário já autenticado, redirecionando:', user);
    
    // Redirecionar para o dashboard apropriado com base no papel do usuário
    if (user.email === 'pabllo.tca@gmail.com' || user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'geradora') {
      return <Navigate to="/geradora" replace />;
    } else if (user.role === 'client') {
      return <Navigate to="/cliente" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Componente para a rota raiz
function RootRedirect() {
  const { user, loading } = useAuth();
  
  // Enquanto estiver carregando, não faz nada
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se já estiver autenticado, redireciona para o dashboard apropriado
  if (user) {
    console.log('Redirecionando da rota raiz para o dashboard apropriado:', user);
    
    if (user.email === 'pabllo.tca@gmail.com' || user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'geradora') {
      return <Navigate to="/geradora" replace />;
    } else if (user.role === 'client') {
      return <Navigate to="/cliente" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se não estiver autenticado, mostra a página de login
  return (
    <MainLayout>
      <Login />
    </MainLayout>
  );
}

// Componente para proteger rotas de geradora
function ProtectedGeradoraRoute({ children }: { children: React.ReactNode }) {
  const { geradora, loading: geradoraLoading } = useGeradoraAuth();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  // Enquanto estiver carregando, não faz nada
  if (geradoraLoading || authLoading) {
    return <div>Carregando...</div>;
  }

  // Verificar se está autenticado como geradora no GeradoraAuthContext
  if (geradora) {
    return <>{children}</>;
  }
  
  // Verificar se está autenticado como geradora no AuthContext
  if (user && user.role === 'geradora') {
    return <>{children}</>;
  }
  
  // Se não estiver autenticado como geradora, redireciona para o login
  return <Navigate to="/geradora-login" state={{ from: location }} replace />;
}

// Componente para a página de login da geradora
function GeradoraLogin() {
  const { loginGeradora } = useGeradoraAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await loginGeradora(email, password);
      // Redirecionar para o dashboard da geradora
      window.location.href = '/geradora';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Login da Geradora</h1>
            <p className="mt-2 text-gray-600">Acesse o portal da geradora</p>
          </div>
          
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <p className="text-gray-600">
                Não tem uma conta? Entre em contato com o administrador.
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <NotificationProvider>
            <GeradoraAuthProvider>
              <InvoiceProvider>
                <GeradoraProvider>
                  <ClienteProvider>
                    <Routes>
                      {/* Rota raiz - Usa o componente RootRedirect para garantir que todos os usuários passem por aqui */}
                      <Route path="/" element={<RootRedirect />} />
                      
                      {/* Rota para login da geradora */}
                      <Route path="/geradora-login" element={<GeradoraLogin />} />
                      
                      {/* Rotas do Portal do Admin (protegidas) */}
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminDashboard />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/clientes" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminClientes />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/geradoras" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminGeradoras />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/cobranca" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminCobranca />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/relatorios" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminRelatorios />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/configuracoes" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout>
                            <AdminConfiguracoes />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />

                      {/* Rotas do Portal da Geradora (usando autenticação local) */}
                      <Route path="/geradora/*" element={
                        <ProtectedGeradoraRoute>
                          <GeradoraLayout>
                            <UsinaProvider>
                              <Routes>
                                <Route index element={<GeradoraDashboard />} />
                                <Route path="clientes" element={<GeradoraClientes />} />
                                <Route path="usinas" element={<GeradoraUsinas />} />
                                <Route path="faturas" element={<GeradoraFaturas />} />
                                <Route path="recebimentos" element={<GeradoraRecebimentos />} />
                                <Route path="relatorios" element={<GeradoraRelatorios />} />
                                <Route path="producao" element={<GeradoraProducao />} />
                                <Route path="configuracoes" element={<GeradoraConfiguracoes />} />
                              </Routes>
                            </UsinaProvider>
                          </GeradoraLayout>
                        </ProtectedGeradoraRoute>
                      } />

                      {/* Rotas do Portal do Cliente */}
                      <Route path="/cliente" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClienteDashboard />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cliente/faturas" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClienteFaturas />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cliente/pagamentos" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClientePagamentos />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cliente/consumo" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClienteConsumo />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cliente/notificacoes" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClienteNotificacoes />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cliente/perfil" element={
                        <ProtectedRoute requiredRole="client">
                          <ClienteLayout>
                            <ClientePerfil />
                          </ClienteLayout>
                        </ProtectedRoute>
                      } />

                      {/* Outras rotas do sistema (protegidas) */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <MainLayout>
                            <Dashboard />
                          </MainLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/invoices" element={
                        <ProtectedRoute>
                          <MainLayout>
                            <Invoices />
                          </MainLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin-legacy" element={
                        <ProtectedRoute requiredRole="admin">
                          <MainLayout>
                            <Admin />
                          </MainLayout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Rota adicional para /geradoras que redireciona para /geradora/usinas */}
                      <Route path="/geradoras" element={<Navigate to="/geradora/usinas" replace />} />
                      
                      {/* Rota de fallback para páginas não encontradas */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ClienteProvider>
                </GeradoraProvider>
              </InvoiceProvider>
            </GeradoraAuthProvider>
          </NotificationProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
