---
title: Docker
sidebar_position: 1
slug: "/docker"
---

# Dockerizando a aplicação

## Introdução: O que é Docker?

&emsp;Docker é uma plataforma de virtualização leve que utiliza contêineres para empacotar e distribuir software. Os contêineres são isolados uns dos outros e contêm o software, as bibliotecas e as dependências necessárias para que ele funcione. Além disso, esses contêineres podem se comunicar uns com os outros por meio de canais bem definidos, garantindo a interoperabilidade. Todos os contêineres compartilham o mesmo kernel do sistema operacional, o que os torna mais eficientes em comparação com máquinas virtuais tradicionais.

## Por que utilizei em minha aplicação?

&emsp;Em minha aplicação, utilizamos o Docker para garantir a consistência do ambiente de desenvolvimento, facilitar o gerenciamento de dependências e simplificar a implantação. O Docker também possibilita que nossos serviços sejam executados de forma isolada, mas com capacidade de comunicação eficiente entre eles. Isso é fundamental para manter a modularidade e escalabilidade do sistema.

## Como configurar (ambiente Linux)

&emsp;Para configurar o Docker em um ambiente Linux, siga os seguintes passos:

**1 -** Instale o Docker:

```python
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

**2 -** Instale o Docker Compose:

```python
sudo curl -L "https://github.com/docker/compose/releases/download/v2.0.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**3 -** Verifique a instalação:

```python
docker --version
docker-compose --version
```

**4 -** Inicie o Docker:

```python
sudo systemctl start docker
sudo systemctl enable docker
```

## Aplicação em meu projeto:

&emsp;A imagem abaixo representa visualmente, por meio de uma Arquitetura, a implementação do Docker em minha aplicação. Nela, estão destacados os principais serviços e suas interconexões. A leitura atenta da legenda facilitará a compreensão de como esses serviços se relacionam.

<p align="center"><b> Figura 1 - Figura arquitetura Docker</b></p>
<div align="center">
  ![](../../../static/img/dockerarch.jpg)
  <p><b>Fonte:</b> Elaborado por Marco Rizzi</p>
</div>

### Label's

- `Imagem:` Representa uma parte da dockerização. Cada label desse tipo aponta para um serviço da nossa aplicação, que tem uma imagem gerada e gerenciada pelo Docker-Compose.

- `Url Connection:` Indica que o serviço está hospedado externamente, por exemplo, em uma solução de nuvem, e que está se conectando à aplicação por meio de uma variável de ambiente configurada no Docker-Compose.

### Serviços

- `Backend:` É uma imagem que aponta para o serviço backend no Docker-Compose. Essa imagem contém a API do projeto, responsável por lidar com a lógica de negócios e a comunicação com o banco de dados.

- `Frontend:` É uma imagem que aponta para o serviço frontend no Docker-Compose. Essa imagem contém a interface visual do projeto, a qual será utilizada pelo cliente.

### Serviços do Docker

- `Compose:` O arquivo **docker-compose.yml** é responsável por orquestrar todos os serviços da aplicação. Ele configura e executa os contêineres, além de possibilitar a comunicação entre os diferentes serviços em um ambiente isolado e controlado.

- `Container:` O Container representa a fase final do processo de dockerização. Ele é um serviço mais abstrato e integrado, onde todos os componentes da aplicação (Backend, Frontend, etc.) se conectam. A partir desse ponto, é possível hospedar a aplicação por completo, unificando os serviços e facilitando o gerenciamento e a escalabilidade.

## Trechos de código relevantes para a aplicação:

&emsp;Nessa seção, exploramos as imagens que criei para cada serviço da aplicação e explico como o orquestrador `Docker-Compose.yml` funciona. A seguir, estão as imagens associadas ao **backend** e **frontend**, além da configuração de serviços no Docker Compose.

### Imagens

**1 -** Imagem do backend:

- Baseada na imagem oficial do Python 3.10.

- Define o diretório de trabalho (`/app`) dentro do contêiner.

- Copia o arquivo `requirements.txt` e instala as dependências necessárias com `pip`.

- Copia o restante do código para o contêiner.

- Expõe a porta 3000 para acessar o serviço da API.

- Utiliza `uvicorn` para iniciar a API no FastAPI.

```python
FROM python:3.11-bullseye

EXPOSE 8000

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**2 -** Imagem do frontend:

- Baseada na imagem oficial do Node.js versão 20.

- Define o diretório de trabalho (`/app`).

- Copia os arquivos `package*.json` para instalar as dependências necessárias com o `npm install`.

- Copia o código do frontend para dentro do contêiner.

- Executa o comando `npm run build` para gerar os arquivos de build da aplicação frontend.

- Expõe a porta 3000 para servir a aplicação frontend.

- Utiliza `npm start` para iniciar o serviço.

```python
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install   
RUN npm run build
CMD ["npm", "start"]
```

### Docker-Compose

&emsp;O arquivo `docker-compose.yml` orquestra todos os serviços da aplicação, permitindo a comunicação entre eles. Aqui, detalhei os serviços principais:

```python
services:
  frontend:
    build: ./frontend
    image: src/frontend
    container_name: frontend
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_BACKEND_URL: "http://backend:8000" 
    ports:
      - "3000:3000"  
    networks:
      - app-network
    depends_on:
      - backend  

  backend:
    build: ./backend
    image: src/backend
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "8000:8000"  
    container_name: backend
    env_file:
      - .env
    volumes:
      - ./backend:/app/backend  
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Explicação dos Serviços no Docker Compose

- Frontend:
        - A imagem do frontend é criada e exposta na porta `3000`. 
        - A URL do backend é passada como uma variável de ambiente `NEXT_PUBLIC_BACKEND_URL`.

- Backend:
        - O serviço de backend é responsável pela API da aplicação e está exposto na porta `8000` para comunicações internas. 
        - O arquivo `.env` é utilizado para passar variáveis sensíveis como a `DATABASE_URL`.

## Conclusão

&emsp;A utilização do Docker para a aplicação proporcionou inúmeros benefícios, desde a consistência no ambiente de desenvolvimento até a facilidade na implantação e escalabilidade. Ao encapsular os diferentes serviços da aplicação em contêineres, conseguimos garantir a modularidade, o isolamento e a interoperabilidade dos componentes, tudo isso com um gerenciamento eficiente de dependências.

&emsp;A estrutura criada com Docker Compose orquestra de maneira simples e eficaz os serviços de backend, frontend e armazenamento de dados, permitindo uma comunicação transparente entre eles e facilitando o monitoramento e a manutenção da aplicação. Com essa configuração, a equipe é capaz de focar mais na evolução do projeto e menos nas complexidades relacionadas ao ambiente, garantindo uma maior produtividade e qualidade no desenvolvimento.