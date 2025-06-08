import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Login() {
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionar usuário já logado com base na role
  useEffect(() => {
    if (user && !authLoading) {
      redirectBasedOnRole();
    }
  }, [user, authLoading, navigate]);

  // Função para redirecionar com base na role do usuário
  const redirectBasedOnRole = () => {
    if (!user) return;

    // Admin fixo do sistema
    if (user.email === 'pabllo.tca@gmail.com' || user.role === 'admin') {
      navigate('/admin');
      return;
    }

    // Geradora
    if (user.role === 'geradora') {
      navigate('/geradora');
      return;
    }

    // Cliente (padrão)
    if (user.role === 'client') {
      navigate('/cliente');
      return;
    }

    // Fallback para dashboard genérico
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      addNotification({
        message: 'Bem-vindo de volta ao sistema.',
        type: 'success',
        title: 'Login realizado com sucesso!'
      });
      // O redirecionamento será feito pelo useEffect quando o usuário for carregado
    } catch (error) {
      addNotification({
        message: 'Verifique suas credenciais e tente novamente.',
        type: 'error',
        title: 'Erro ao fazer login'
      });
    } finally {
      setLoading(false);
    }
  };

  // Função de login principal já implementada acima

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            {/* Botão de login rápido removido - não é mais necessário */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
