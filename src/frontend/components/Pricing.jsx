import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const Pricing = () => {
  const [prices, setPrices] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);

  const fetchPriceHistory = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30');
      const priceData = response.data.prices;
      const priceArray = priceData.map((price) => price[1]);
      const dateArray = priceData.map((price) => new Date(price[0]));
      setPrices(priceArray);
      setDates(dateArray);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar o histórico de preços:', error);
      setError('Erro ao carregar os dados');
      setLoading(false);
    }
  };

  const fetchLatestPrediction = async () => {
    try {
      const response = await axios.get('http://localhost:8000/predicts/list');
      if (response.data && response.data.predict && response.data.predict.length > 0) {
        const sortedPredictions = response.data.predict.sort((a, b) => b.id - a.id);
        setLatestPrediction(sortedPredictions[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar última previsão:', error);
      setError('Erro ao buscar última previsão');
    }
  };

  useEffect(() => {
    fetchPriceHistory();
    fetchLatestPrediction();
  }, []);

  // Obter o preço atual da última entrada do histórico de preços
  useEffect(() => {
    if (prices.length > 0) {
      setCurrentPrice(prices[prices.length - 1]); // Último preço da lista
    }
  }, [prices]);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Preço do Ethereum (USD)',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histórico do Preço do Ethereum - Últimos 30 Dias',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM dd, yyyy',
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Preço (USD)',
        },
      },
    },
  };

  const renderRecommendation = () => {
    if (!latestPrediction || currentPrice === null) {
      return null; 
    }

    const predictedValue = latestPrediction.forecast_result[0]?.predicted_value; 
    if (predictedValue < currentPrice) {
      return <p className="text-red-500">Recomendado: Vender</p>;
    } else if (predictedValue > currentPrice) {
      return <p className="text-green-500">Recomendado: Comprar mais</p>;
    } else {
      return <p className="text-yellow-500">Recomendado: Manter</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Carregando gráfico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-20">
        <h1 className="text-2xl mt-4">Preço Atual: {currentPrice ? `$${currentPrice.toFixed(2)}` : 'N/A'}</h1>
        {renderRecommendation()}
        <h1 className="text-2xl">Gráfico de Preços do Ethereum (Últimos 30 Dias)</h1>
        {prices.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <p className="text-xl mt-4">Nenhum dado disponível.</p>
        )}
      </div>
    </div>
  );
};

export default Pricing;
