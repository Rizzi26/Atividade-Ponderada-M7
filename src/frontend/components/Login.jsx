// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login e signup
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login bem-sucedido!');
        console.log('Resposta da API:', data); 
        const userId = data.user?.id; 
        if (userId) {
          router.push(`/home?id=${userId}`);
        } else {
          toast.error('ID do usuário não encontrado.');
          setError('ID do usuário não encontrado.');
        }
      } else {
        toast.error('Usuário ou senha incorreta!');
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Erro interno do servidor. Tente novamente mais tarde.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Conta criada com sucesso!');
        setIsLogin(true); // Alternar para login após registro bem-sucedido
      } else {
        toast.error('Erro ao criar conta.');
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (err) {
      console.error('Erro durante o registro:', err);
      setError('Erro interno do servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? 'Login' : 'Registro'}
        </h1>
        <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="flex flex-col space-y-4 mt-4">
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Registrar'}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? 'Registrar' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
