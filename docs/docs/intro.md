---
sidebar_position: 1
slug: "/"
---

# Introdução

Este projeto foi desenvolvido como parte das **Atividades Ponderadas do Módulo**, onde o objetivo era aplicar técnicas de **análise de dados** e **machine learning** em um cenário real para apoiar decisões de investimentos em criptoativos. Trabalhei focado no par **ETH-USD**, desenvolvendo um sistema que oferece previsões e insights baseados no histórico de preços, ajudando os usuários a tomar decisões mais embasadas sobre a compra, venda ou manutenção dos ativos.

# Contexto

A proposta da atividade envolvia construir um sistema de auxílio à decisão, analisando o comportamento histórico de um ou dois criptoativos. Escolhi o **Ethereum (ETH)** como criptoativo de referência e desenvolvi um modelo preditivo utilizando **redes neurais recorrentes (LSTM e GRU)**. O modelo foi treinado para prever o preço futuro com base em um período de tempo definido pelo usuário, proporcionando uma visão clara do que pode acontecer nos próximos dias.

# Funcionalidades Principais

O sistema que desenvolvi conta com as seguintes funcionalidades:

- **Previsão do preço futuro:** A partir do número de dias informado pelo usuário, o modelo gera uma previsão do preço futuro do criptoativo ETH-USD. A ideia é oferecer uma ferramenta útil para investidores que podem usar essas previsões para planejar melhor suas estratégias de compra e venda.

- **Sugestão de ação:** Com base na previsão, o sistema recomenda se o usuário deve comprar, vender ou manter o criptoativo, oferecendo insights práticos.

- **Monitoramento em tempo real:** Criei um dashboard interativo que exibe os preços atuais do ETH-USD em tempo real, permitindo que o usuário compare o preço atual com a previsão gerada.

- **Sistema de logs:** Todas as ações realizadas no sistema são registradas, garantindo um histórico detalhado.

# Tecnologias Utilizadas 

O projeto foi desenvolvido principalmente em **Python**, usando diversas bibliotecas de machine learning para implementar os modelos LSTM e GRU. Manipulei os dados com **Pandas** e visualizei os resultados através de um dashboard interativo. Todos os dados foram armazenados em um banco de dados **PostgreSQL**, e utilizei **Docker** para garantir escalabilidade e flexibilidade.

Algumas das tecnologias e frameworks principais que utilizei incluem:

- **TensorFlow/Keras** para criação e treinamento dos modelos de redes neurais.
- **Pandas** e **NumPy** para manipulação e exploração dos dados.
- **Matplotlib** e **Plotly** para gerar visualizações e gráficos interativos.
- **SQLAlchemy** para a interação com o banco de dados PostgreSQL.
- **Docker** para facilitar o ambiente de desenvolvimento e a implantação do projeto.

# Metodologia de Desenvolvimento 

Segui uma abordagem em etapas, começando pela exploração dos dados para entender os padrões históricos e selecionar as variáveis mais relevantes para os modelos preditivos. O modelo foi treinado com dados históricos do ETH-USD e passou por vários testes e ajustes para garantir a maior precisão possível nas previsões.

# Conclusão

Este projeto me permitiu aplicar na prática **machine learning** e **análise de dados** para resolver problemas reais, como a previsão de preços de criptoativos. Com uma interface simples e intuitiva, logs detalhados e previsões precisas, o sistema oferece uma solução robusta para investidores que buscam apoio analítico em suas estratégias. A arquitetura modular, o uso de tecnologias modernas como **Docker** e **PostgreSQL** e o histórico do projeto garantem que ele seja escalável e flexível para futuras melhorias.
