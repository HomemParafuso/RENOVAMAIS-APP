import { useAuth } from '@/context/AuthContext';
import { useInvoice } from '@/context/InvoiceContext';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Invoices() {
  const { user } = useAuth();
  const { invoices, loading } = useInvoice();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Faturas</h1>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Faturas</TabsTrigger>
          <TabsTrigger value="add">Adicionar Fatura</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceList invoices={invoices} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <InvoiceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
} 