
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ClientesPage from "./pages/ClientesPage";
import GeradorasPage from "./pages/GeradorasPage";
import FaturasPage from "./pages/FaturasPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import PixPage from "./pages/PixPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";

// Imports do Portal do Cliente
import ClienteLayout from "./portal-cliente/layout/ClienteLayout";
import ClienteDashboard from "./portal-cliente/pages/ClienteDashboard";
import ClienteFaturas from "./portal-cliente/pages/ClienteFaturas";
import ClienteConsumo from "./portal-cliente/pages/ClienteConsumo";
import ClientePagamentos from "./portal-cliente/pages/ClientePagamentos";
import ClienteNotificacoes from "./portal-cliente/pages/ClienteNotificacoes";
import ClientePerfil from "./portal-cliente/pages/ClientePerfil";

// Imports do Portal Administrativo
import { AdminAuthProvider, useAdminAuth } from "./admin/context/AdminAuthContext";
import AdminLoginForm from "./admin/components/AdminLoginForm";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminGeradoras from "./admin/pages/AdminGeradoras";
import AdminClientes from "./admin/pages/AdminClientes";
import AdminCobranca from "./admin/pages/AdminCobranca";
import AdminRelatorios from "./admin/pages/AdminRelatorios";
import AdminConfiguracoes from "./admin/pages/AdminConfiguracoes";

const queryClient = new QueryClient();

// Componente para proteger rotas do admin
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            {/* Rotas do sistema principal (geradora) */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/clientes" element={<Layout><ClientesPage /></Layout>} />
            <Route path="/geradoras" element={<Layout><GeradorasPage /></Layout>} />
            <Route path="/faturas" element={<Layout><FaturasPage /></Layout>} />
            <Route path="/financeiro" element={<Layout><FinanceiroPage /></Layout>} />
            <Route path="/recebimentos" element={<Layout><PixPage /></Layout>} />
            <Route path="/relatorios" element={<Layout><RelatoriosPage /></Layout>} />
            <Route path="/configuracoes" element={<Layout><ConfiguracoesPage /></Layout>} />
            
            {/* Rotas do portal do cliente */}
            <Route path="/cliente" element={<ClienteLayout><ClienteDashboard /></ClienteLayout>} />
            <Route path="/cliente/faturas" element={<ClienteLayout><ClienteFaturas /></ClienteLayout>} />
            <Route path="/cliente/consumo" element={<ClienteLayout><ClienteConsumo /></ClienteLayout>} />
            <Route path="/cliente/pagamentos" element={<ClienteLayout><ClientePagamentos /></ClienteLayout>} />
            <Route path="/cliente/notificacoes" element={<ClienteLayout><ClienteNotificacoes /></ClienteLayout>} />
            <Route path="/cliente/perfil" element={<ClienteLayout><ClientePerfil /></ClienteLayout>} />
            
            {/* Rotas do portal administrativo */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/geradoras" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminGeradoras /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/clientes" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminClientes /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/cobranca" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminCobranca /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/relatorios" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminRelatorios /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/configuracoes" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminConfiguracoes /></AdminLayout>
              </AdminProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
