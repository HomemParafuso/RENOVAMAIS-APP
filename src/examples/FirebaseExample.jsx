import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addFatura, getFaturas, updateFatura } from '@/utils/firebaseApi';

// Exemplo de componente que usa o Firebase
export default function FirebaseExample() {
  const { user, login, logout, signup } = useAuth();
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Formulário de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Formulário de fatura
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  
  // Carregar faturas quando o usuário estiver autenticado
  useEffect(() => {
    async function loadFaturas() {
      if (user) {
        try {
          setLoading(true);
          const result = await getFaturas({
            filters: [
              { field: 'userId', operator: '==', value: user.id }
            ]
          });
          setFaturas(result.data);
        } catch (err) {
          console.error('Erro ao carregar faturas:', err);
          setError('Falha ao carregar faturas. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      }
    }
    
    loadFaturas();
  }, [user]);
  
  // Função para fazer login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para registrar
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signup(email, password, name);
      setEmail('');
      setPassword('');
      setName('');
      setIsRegistering(false);
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError('Falha ao registrar. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError('Falha ao fazer logout. Tente novamente mais tarde.');
    }
  };
  
  // Função para adicionar fatura
  const handleAddFatura = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      const newFatura = {
        userId: user.id,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: 'pending',
        description
      };
      
      await addFatura(newFatura);
      
      // Recarregar faturas
      const result = await getFaturas({
        filters: [
          { field: 'userId', operator: '==', value: user.id }
        ]
      });
      setFaturas(result.data);
      
      // Limpar formulário
      setAmount('');
      setDueDate('');
      setDescription('');
    } catch (err) {
      console.error('Erro ao adicionar fatura:', err);
      setError('Falha ao adicionar fatura. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para marcar fatura como paga
  const handleMarkAsPaid = async (faturaId) => {
    try {
      setLoading(true);
      await updateFatura(faturaId, { status: 'paid' });
      
      // Recarregar faturas
      const result = await getFaturas({
        filters: [
          { field: 'userId', operator: '==', value: user.id }
        ]
      });
      setFaturas(result.data);
    } catch (err) {
      console.error('Erro ao atualizar fatura:', err);
      setError('Falha ao atualizar fatura. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Firebase</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {!user ? (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isRegistering ? 'Registrar' : 'Login'}
          </h2>
          
          <form onSubmit={isRegistering ? handleSignup : handleLogin}>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Login'}
              </button>
              
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Registre-se'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Bem-vindo, {user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Função: {user.role}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Adicionar Nova Fatura</h2>
            
            <form onSubmit={handleAddFatura}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Data de Vencimento</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Adicionar Fatura'}
              </button>
            </form>
          </div>
          
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Suas Faturas</h2>
            
            {loading ? (
              <p>Carregando faturas...</p>
            ) : faturas.length === 0 ? (
              <p>Nenhuma fatura encontrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Descrição</th>
                      <th className="py-2 px-4 border-b text-left">Valor</th>
                      <th className="py-2 px-4 border-b text-left">Vencimento</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faturas.map((fatura) => (
                      <tr key={fatura.id}>
                        <td className="py-2 px-4 border-b">{fatura.description}</td>
                        <td className="py-2 px-4 border-b">
                          R$ {fatura.amount.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {fatura.dueDate.toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              fatura.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : fatura.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {fatura.status === 'paid'
                              ? 'Pago'
                              : fatura.status === 'overdue'
                              ? 'Atrasado'
                              : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          {fatura.status !== 'paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(fatura.id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              disabled={loading}
                            >
                              Marcar como Pago
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
