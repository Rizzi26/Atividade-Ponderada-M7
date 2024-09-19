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

  // Obtém o valor do parâmetro 'id' da URL
  const { id } = router.query;
  const paramValue = id || ''; // Adiciona um valor padrão caso `id` seja undefined

  console.log(paramValue); // Exibe o valor de 'id' no console

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

  const handleNewPrediction = async () => {
    setIsSubmitting(true);
    try {
      const url = `http://localhost:8000/predicts/predict/${selectedModel}`; 
      const response = await axios.post(url, {
        username: "Rizzadinha22", 
        user_id: 4,               
        forecast: true,
        forecast_result: "string" 
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

  return (
    <div>
      <Navbar id={paramValue} />
      <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-6">
        <h2 className="text-xl font-medium mb-2">Última previsão:</h2>
        {latestPrediction ? (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
            <p><strong>Usuário:</strong> {latestPrediction.username_predict}</p>
            <p><strong>Modelo utilizado:</strong> {latestPrediction.model}</p>
            <p><strong>Data:</strong> {latestPrediction.date}</p>
            <p><strong>Resultado da previsão:</strong></p>
            <ul className="list-disc pl-5">
              {latestPrediction.forecast_result.map((item, index) => (
                <li key={index}>
                  Data: {formatDate(item.date)} - Valor em USD $: {item.predicted_value.toFixed(2)} 
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">Nenhuma previsão encontrada.</p>
        )}

        <div className="w-full max-w-md">
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
        </div>

        <button
          onClick={handleNewPrediction}
          className={`bg-blue-500 text-white p-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Criar Nova Previsão'}
        </button>
      </div>
    </div>
  );
};

export default NewPredict;
