import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Adicione esta linha

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { query } = router;
  const paramValue = query.id; // Obtém o valor do parâmetro 'id' da URL

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/logs/list/');
        const data = await response.json();
        if (response.ok) {
          setLogs(data.logs);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Erro ao buscar logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar id={paramValue} />
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-2xl mb-4">Logs da Aplicação</h1>

        {loading ? (
          <p>Carregando logs...</p>
        ) : error ? (
          <p>{error}</p>
        ) : logs.length === 0 ? (
          <p>Nenhum log encontrado.</p>
        ) : (
          <div className="w-full max-w-4xl">
            <table className="table-auto w-full text-center">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Usuário</th>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Ação</th>
                  <th className="px-4 py-2">ID Usuário</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="bg-gray-700">
                    <td className="border px-4 py-2">{log.id}</td>
                    <td className="border px-4 py-2">{log.username_log}</td>
                    <td className="border px-4 py-2">{log.date}</td>
                    <td className="border px-4 py-2">{log.action}</td>
                    <td className="border px-4 py-2">{log.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="flex justify-center mt-4">
              {[...Array(Math.ceil(logs.length / logsPerPage)).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-4 py-2 mx-1 ${currentPage === number + 1 ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-700 text-white font-bold rounded`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
