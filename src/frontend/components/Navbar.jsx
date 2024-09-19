import { useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = ({ id }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter(); // Hook para obter a rota atual

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para verificar se a rota está ativa
  const isActive = (pathname) => router.pathname === pathname;

  // Função para navegar mantendo o parâmetro 'id'
  const navigateWithId = (path) => {
    router.push({
      pathname: path,
      query: { id }, // Inclui o parâmetro 'id' na URL
    });
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://github.com/Rizzi26/Atividade-Ponderada-M7" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="btc.png" className="h-16" alt="Criptozzi Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Criptozzi</span>
        </a>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`w-full md:block md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                onClick={() => navigateWithId('/home')}
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActive('/home') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateWithId('/new-predict')}
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActive('/new-predict') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                New Predict
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateWithId('/pricing')}
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActive('/pricing') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                Pricing now
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateWithId('/logs')}
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActive('/logs') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                Logs
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
