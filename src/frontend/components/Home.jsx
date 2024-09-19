import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Importa o componente da Navbar

const HomePage = () => {
  const router = useRouter();

  // Obtém o valor do parâmetro 'id' da URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get('id');

  console.log(paramValue); // Exibe o valor de 'id' no console

  return (
    <div>
      <Navbar id={paramValue} /> {/* Passa o valor de 'id' para a Navbar */}
      <h1>Bem-vindo!</h1>
    </div>
  );
};

export default HomePage;
