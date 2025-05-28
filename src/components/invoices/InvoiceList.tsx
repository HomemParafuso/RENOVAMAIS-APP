import { useInvoice } from '@/context/InvoiceContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InvoiceListProps {
  invoices: any[];
  loading: boolean;
}

export function InvoiceList({ invoices, loading }: InvoiceListProps) {
  const { removeInvoice, updateInvoiceStatus } = useInvoice();
  const { addNotification } = useNotification();

  const handleRemove = async (id: string) => {
    try {
      await removeInvoice(id);
      addNotification('Fatura removida com sucesso!', 'success');
    } catch (error) {
      addNotification('Erro ao remover fatura.', 'error');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'paid' | 'overdue') => {
    try {
      await updateInvoiceStatus(id, status);
      addNotification('Status da fatura atualizado com sucesso!', 'success');
    } catch (error) {
      addNotification('Erro ao atualizar status da fatura.', 'error');
    }
  };

  if (loading) {
    return <div>Carregando faturas...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.status === 'paid'
                      ? 'success'
                      : invoice.status === 'overdue'
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {invoice.status === 'paid'
                    ? 'Pago'
                    : invoice.status === 'overdue'
                    ? 'Vencido'
                    : 'Pendente'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(invoice.id, 'paid')}
                  >
                    Marcar como Pago
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(invoice.id)}
                  >
                    Remover
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 