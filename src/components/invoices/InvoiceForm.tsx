import { useState } from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InvoiceForm() {
  const { addInvoice } = useInvoice();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    amount: '',
    dueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addInvoice({
        number: formData.number,
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate).toISOString(),
      });

      setFormData({
        number: '',
        amount: '',
        dueDate: '',
      });

      addNotification({
        message: 'Fatura adicionada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        message: 'Erro ao adicionar fatura. Tente novamente.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Fatura</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número da Fatura</Label>
            <Input
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar Fatura'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 