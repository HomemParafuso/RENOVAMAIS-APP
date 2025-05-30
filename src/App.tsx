
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { InvoiceProvider } from '@/context/InvoiceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import GeradoraLayout from '@/portal-geradora/layout/GeradoraLayout';

// Páginas do Portal da Geradora
import GeradoraDashboard from '@/portal-geradora/pages/Dashboard';
import GeradoraClientes from '@/portal-geradora/pages/Clientes';
import GeradoraGeradoras from '@/portal-geradora/pages/Geradoras';
import GeradoraFaturas from '@/portal-geradora/pages/Faturas';
import GeradoraFinanceiro from '@/portal-geradora/pages/Financeiro';
import GeradoraRecebimentos from '@/portal-geradora/pages/Recebimentos';
import GeradoraRelatorios from '@/portal-geradora/pages/Relatorios';
import GeradoraConfiguracoes from '@/portal-geradora/pages/Configuracoes';

// Outras páginas
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Invoices } from '@/pages/Invoices';
import { Admin } from '@/pages/Admin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <InvoiceProvider>
            <Routes>
              {/* Rotas do Portal da Geradora */}
              <Route path="/" element={
                <GeradoraLayout>
                  <GeradoraDashboard />
                </GeradoraLayout>
              } />
              <Route path="/clientes" element={
                <GeradoraLayout>
                  <GeradoraClientes />
                </GeradoraLayout>
              } />
              <Route path="/geradoras" element={
                <GeradoraLayout>
                  <GeradoraGeradoras />
                </GeradoraLayout>
              } />
              <Route path="/faturas" element={
                <GeradoraLayout>
                  <GeradoraFaturas />
                </GeradoraLayout>
              } />
              <Route path="/financeiro" element={
                <GeradoraLayout>
                  <GeradoraFinanceiro />
                </GeradoraLayout>
              } />
              <Route path="/recebimentos" element={
                <GeradoraLayout>
                  <GeradoraRecebimentos />
                </GeradoraLayout>
              } />
              <Route path="/relatorios" element={
                <GeradoraLayout>
                  <GeradoraRelatorios />
                </GeradoraLayout>
              } />
              <Route path="/configuracoes" element={
                <GeradoraLayout>
                  <GeradoraConfiguracoes />
                </GeradoraLayout>
              } />

              {/* Outras rotas do sistema */}
              <Route path="/login" element={
                <MainLayout>
                  <Login />
                </MainLayout>
              } />
              <Route path="/dashboard" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/invoices" element={
                <MainLayout>
                  <Invoices />
                </MainLayout>
              } />
              <Route path="/admin" element={
                <MainLayout>
                  <Admin />
                </MainLayout>
              } />
            </Routes>
          </InvoiceProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
