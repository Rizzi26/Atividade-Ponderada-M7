import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewPredict = () => {
  const [latestPrediction, setLatestPrediction] = useState(null); // Armazena a última previsão
  const [selectedModel, setSelectedModel] = useState('LSTM'); // Modelo selecionado pelo usuário
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de submissão

  // Função para buscar a última previsão
  const fetchLatestPrediction = async () => {
    try {
      const response = await axios.get('http://localhost:8000/predicts/list');
      if (response.data && response.data.predict && response.data.predict.length > 0) {
        // Ordena as previsões pelo ID em ordem decrescente e pega o item com o maior ID
        const sortedPredictions = response.data.predict.sort((a, b) => b.id - a.id);
        setLatestPrediction(sortedPredictions[0]); // Assume que o primeiro item é o mais recente
      }
    } catch (error) {
      console.error('Erro ao buscar última previsão:', error);
      toast.error('Erro ao buscar última previsão.');
    }
  };

  // Função para lidar com a submissão de uma nova previsão
  const handleNewPrediction = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/predicts/new', {
        model: selectedModel,
        forecats: true,
        username_predict: "Rizzi",
        user_id: 1,
        forecast_result: 80,
        date: null
      });

      if (response.status === 200) {
        toast.success('Nova previsão criada com sucesso!');
        fetchLatestPrediction(); // Atualiza a previsão mais recente
      }
    } catch (error) {
      console.error('Erro ao criar nova previsão:', error);
      toast.error('Erro ao criar nova previsão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UseEffect para buscar a previsão mais recente ao carregar o componente
  useEffect(() => {
    fetchLatestPrediction();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-6">
      <h2 className="text-xl font-medium mb-2">Última previsão:</h2>
      {/* Exibe a última previsão, se existir */}
      {latestPrediction ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
          <p><strong>Usuário:</strong> {latestPrediction.username_predict}</p>
          <p><strong>Resultado da previsão:</strong> {latestPrediction.forecast_result}</p>
          <p><strong>Modelo utilizado:</strong> {latestPrediction.model}</p>
          <p><strong>Data:</strong> {latestPrediction.date}</p>
        </div>
      ) : (
        <p className="text-gray-400">Nenhuma previsão encontrada.</p>
      )}

      {/* Dropdown para selecionar o modelo */}
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Nova Previsão</h1>
        <label htmlFor="modelSelect" className="block text-sm font-medium text-gray-300 mb-2">Selecione o modelo:</label>
        <select
          id="modelSelect"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
        >
          <option value="LSTM">LSTM</option>
          <option value="GRU">GRU</option>
          <option value="GARCH">GARCH</option>
        </select>
      </div>

      {/* Botão para enviar nova previsão */}
      <button
        onClick={handleNewPrediction}
        className={`bg-blue-500 text-white p-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Criar Nova Previsão'}
      </button>
    </div>
  );
};

export default NewPredict;
