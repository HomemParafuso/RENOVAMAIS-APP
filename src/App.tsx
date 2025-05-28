import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { InvoiceProvider } from '@/context/InvoiceContext';
import { MainLayout } from '@/components/layout/MainLayout';
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
            <MainLayout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          </InvoiceProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
