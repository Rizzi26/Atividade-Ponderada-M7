import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Envia os dados do login
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        toast.success('Login bem-sucedido!');
        setTimeout(() => {
          router.push('/home'); // Redireciona para a página inicial
        }, 1000);
      } else {
        // Erro no login
        toast.error('Usuarios ou senha incorreta!');
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Erro interno do servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
          <label className="flex flex-col">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </label>
          <label className="flex flex-col">
            Senha:
            <input
              type="password" // Mudei para tipo "password" para esconder a senha
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </label>

          {/* Exibe a mensagem de erro caso os dados estejam incorretos */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
