import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router'; // Mantém esta linha
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Registrar os componentes do Chart.js, incluindo TimeScale
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const Pricing = () => {
  const [prices, setPrices] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionando estado de carregamento
  const [error, setError] = useState(null); // Adicionando estado de erro

  const router = useRouter();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get('id');

  console.log(paramValue); // Exibe o valor de 'id' no console

  const fetchPriceHistory = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30'
      );
      
      console.log(response.data); // Adiciona este console.log para inspecionar os dados retornados
  
      const priceData = response.data.prices;
      const priceArray = priceData.map((price) => price[1]);
      const dateArray = priceData.map((price) => new Date(price[0])); // Manter datas como objetos Date
  
      console.log('Preços:', priceArray);
      console.log('Datas:', dateArray);
  
      setPrices(priceArray);
      setDates(dateArray);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar o histórico de preços:', error);
      setError('Erro ao carregar os dados');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceHistory();
  }, []);

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
          unit: 'day', // Granularidade do eixo X em dias
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

  // Verificar o estado de erro ou carregamento
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
      <Navbar id={paramValue} />
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-20">
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
