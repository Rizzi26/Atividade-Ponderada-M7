import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

const NewPredict = () => {
  const router = useRouter();
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [selectedModel, setSelectedModel] = useState('lstm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [days, setDays] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const rowsPerPage = 7; // Limite de linhas por página

  // Captura o id do usuário da URL
  const { id } = router.query;
  const paramValue = id || ''; // Se não houver ID, valor padrão vazio

  const fetchLatestPrediction = async () => {
    try {
      const response = await axios.get('http://localhost:8000/predicts/list');
      if (response.data && response.data.predict && response.data.predict.length > 0) {
        const sortedPredictions = response.data.predict.sort((a, b) => b.id - a.id);
        setLatestPrediction(sortedPredictions[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar última previsão:', error);
      toast.error('Erro ao buscar última previsão.');
    }
  };

  const handleUser = async () => {
    
  }

  const handleNewPrediction = async () => {
    setIsSubmitting(true);
    try {
      const url = `http://localhost:8000/predicts/predict/${selectedModel}`;
      const response = await axios.post(url, {
        username: "Rizzadinha22",  // Você pode usar o username do usuário real, se disponível
        user_id: paramValue,       // Envia o ID do usuário capturado da URL
        forecast: true,
        forecast_result: "string",
        days: parseInt(days)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success('Nova previsão criada com sucesso!');
        fetchLatestPrediction();
      }
    } catch (error) {
      console.error('Erro ao criar nova previsão:', error);
      toast.error('Erro ao criar nova previsão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLatestPrediction();
  }, []);

  const formatDate = (dateString) => {
    try {
      const isoDateString = dateString.replace(' ', 'T');
      const parsedDate = new Date(isoDateString);
      if (isNaN(parsedDate.getTime())) {
        return 'Data inválida';
      }
      return format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Erro ao formatar data';
    }
  };

  // Paginação: calcular previsões atuais para exibir
  const indexOfLastPrediction = currentPage * rowsPerPage;
  const indexOfFirstPrediction = indexOfLastPrediction - rowsPerPage;
  const currentPredictions = latestPrediction ? latestPrediction.forecast_result.slice(indexOfFirstPrediction, indexOfLastPrediction) : [];

  // Mudar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = latestPrediction ? Math.ceil(latestPrediction.forecast_result.length / rowsPerPage) : 0;

  return (
    <div>
      <Navbar id={paramValue} />
      <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-6">
        {/* Log da previsão */}
        {latestPrediction ? (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
            <p><strong>Usuário:</strong> {latestPrediction.username_predict}</p>
            <p><strong>Modelo utilizado:</strong> {latestPrediction.model}</p>
            <p><strong>Data:</strong> {latestPrediction.date}</p>
          </div>
        ) : (
          <p className="text-gray-400">Nenhuma previsão encontrada.</p>
        )}

        {/* Tabela de previsão */}
        {latestPrediction && latestPrediction.forecast_result.length > 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md mt-6">
            <h2 className="text-xl font-medium mb-4">Resultado da Previsão:</h2>
            <table className="table-auto w-full text-left text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Valor em USD ($)</th>
                </tr>
              </thead>
              <tbody>
                {currentPredictions.map((item, index) => (
                  <tr key={index} className="bg-gray-700">
                    <td className="border px-4 py-2">{formatDate(item.date)}</td>
                    <td className="border px-4 py-2">{item.predicted_value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-4 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Nenhum resultado de previsão encontrado.</p>
        )}

        {/* Formulário de nova previsão */}
        <div className="w-full max-w-md mt-6">
          <h1 className="text-2xl font-semibold">Nova Previsão</h1>
          <label htmlFor="modelSelect" className="block text-sm font-medium text-gray-300 mb-2">Selecione o modelo:</label>
          <select
            id="modelSelect"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
          >
            <option value="lstm">LSTM</option>
            <option value="gru">GRU</option>
          </select>

          <label htmlFor="inputDays" className="block text-sm font-medium text-gray-300 mt-4 mb-2">
            Insira a quantidade de dias para previsão:
          </label>
          <input
            id="inputDays"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
            placeholder="Digite o número de dias"
          />
        </div>

        <button
          onClick={handleNewPrediction}
          className={`bg-blue-500 text-white p-2 rounded-lg mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Criar Nova Previsão'}
        </button>
      </div>
    </div>
  );
};

export default NewPredict;
