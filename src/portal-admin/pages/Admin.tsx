import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationList } from '@/components/notifications/NotificationList';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { useInvoice } from '@/context/InvoiceContext';

export function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { invoices, loading } = useInvoice();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      addNotification({
        message: 'Acesso não autorizado',
        type: 'error',
      });
      navigate('/');
    }
  }, [user, navigate, addNotification]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceList invoices={invoices} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
