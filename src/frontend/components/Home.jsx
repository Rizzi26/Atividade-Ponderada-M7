import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const HomePage = () => {
  const router = useRouter();
  const [paramValue, setParamValue] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('id');
    setParamValue(value);
    console.log(value); // Exibe o valor de 'id' no console
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <Navbar id={paramValue} />
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 mt-10">
        <h1 className="text-3xl font-bold text-center mb-4">Bem-vindo !</h1>
        <p className="text-gray-300 mb-6">
          Aqui você encontrará uma breve explicação de como utilizar a aplicação.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Páginas da Aplicação</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Nova Previsão</h3>
          <p className="text-gray-300">
            Na página <strong>Nova Previsão</strong>, você pode analisar a última previsão feita e quem a realizou.
            É possível escolher entre os modelos <strong>GRU</strong> e <strong>LSTM</strong> para fazer uma nova previsão,
            além de selecionar quantos dias à frente o modelo deve prever.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Logs</h3>
          <p className="text-gray-300">
            A página <strong>Logs</strong> permite visualizar o registro de uso da aplicação.
            Você poderá ver quem fez login, quem fez previsões, quaisquer erros que ocorreram ao realizar ações,
            e consultar a data e horário em que cada ação foi realizada.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Pricing</h3>
          <p className="text-gray-300">
            Na página <strong>Pricing</strong>, você encontrará uma API que mostra em tempo real o preço da moeda,
            exibido em um gráfico.
            Nesta página, é possível observar o preço atual da moeda e, com base na última previsão feita na plataforma,
            receber uma recomendação sobre se é melhor vender ou comprar a moeda em questão.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">Documentação</h3>
          <p className="text-gray-300">
            Ao clicar nesse botão abaixo você pode conferir a Documentação do projeto, onde contempla sua construção e as tecnologias utilizadas.
          </p>
          <a
            href="https://rizzi26.github.io/Atividade-Ponderada-M7/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Acessar Documentação
          </a>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">GitHub</h3>
          <p className="text-gray-300">
            Ao clicar nesse botão abaixo você pode conferir o repositório do projeto.
          </p>
          <a
            href="https://github.com/Rizzi26/Atividade-Ponderada-M7/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Acessar Documentação
          </a>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
