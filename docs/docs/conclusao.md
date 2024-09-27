---
sidebar_position: 2
slug: "/conclusao"
---

# Como utilizar a aplicação

## Clonar o repositorio 

&emsp;Para começar a usar a aplicação, o primeiro passo é clonar o repositório do projeto em sua máquina local. Para isso, siga o comando abaixo no terminal:

```python
git clone git@github.com:Rizzi26/Atividade-Ponderada-M7.git
```

&emsp;Após o clone, navegue até o diretório do projeto:

```python
cd Atividade-Ponderada-M7
```

## Configurar o docker em sua maquina

&emsp;Para que a aplicação rode corretamente, é necessário que o Docker esteja configurado em sua máquina. Caso ainda não tenha o Docker instalado e configurado, siga o guia de configuração na [Seção docker do Docussauros](http://localhost:3000/Atividade-Ponderada-M7/docker) onde você encontrará um passo a passo completo de como instalar e configurar o Docker.

>**Nota:** Certifique-se de seguir todos os passos corretamente para evitar problemas durante o build e execução da aplicação.

## Buildar o sistema na sua maquina

&emsp;Com o Docker configurado, o próximo passo é buildar e rodar o sistema localmente. No diretório do projeto navegue até a pasta `src` e execute o seguinte comando para iniciar o Docker Compose, que irá configurar e inicializar todos os serviços necessários:

```python
docker-compose up --build
```

&emsp;Esse comando irá:

- Criar as imagens necessárias para o backend e frontend da aplicação.

- Instanciar os containers de todos os serviços, como banco de dados e a aplicação em si.

- Tornar a aplicação acessível através da sua porta local configurada no `docker-compose.yml`.

Após o build, você poderá acessar a aplicação no navegador através de `http://localhost:3000`.

## Vídeo de demonstração

&emsp;Se desejar uma explicação visual de como a aplicação funciona, você pode assistir ao vídeo de demonstração que mostra as principais funcionalidades e fluxos de uso da aplicação ao clicar [nesse link](https://youtu.be/N_kApI3CcVI)

# Conclusão

&emsp;Agora que você clonou o repositório, configurou o Docker, buildou o sistema e acompanhou o vídeo de demonstração, você está pronto para utilizar a aplicação e explorar suas funcionalidades! Se tiver dúvidas ou problemas durante a configuração, consulte a documentação ou entre em contato através do repositório no GitHub.

