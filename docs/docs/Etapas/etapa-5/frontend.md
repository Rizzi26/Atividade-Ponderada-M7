---
title: Frontend
sidebar_position: 1
slug: "/frontend"
---

# Frontend da aplicação

## Introdução: Escolha da tecnologia para o desenvolvimento do frontend

&emsp;Para o desenvolvimento do frontend da aplicação, optou-se por utilizar Next.js devido ao seu excelente suporte para server-side rendering (SSR) e static site generation (SSG), além da integração simplificada com a Vercel para deploy contínuo e eficiente. O Next.js também oferece uma boa performance, otimizações automáticas e roteamento simplificado.

## Estilização com Tailwind CSS

&emsp;A estilização da aplicação foi feita com Tailwind CSS, um framework CSS utilitário que permite construir interfaces rápidas e responsivas de forma eficiente, sem a necessidade de escrever folhas de estilo CSS complexas. Ele possibilita criar componentes estilizados de forma concisa diretamente nos templates do React.

## Por que não foquei em um frontend muito elaborado?

&emsp;Apesar de a aplicação ser funcional, o foco principal foi na robustez do backend e na precisão dos serviços de predição. O design, embora limpo e intuitivo, não foi a prioridade, dado que a aplicação tem como objetivo fornecer análises e previsões rápidas de moedas e logs de uso. O uso de Tailwind CSS garantiu uma interface coesa e simples, sem a necessidade de investir em uma interface visual extremamente elaborada.

## Paginas principais da aplicação e navegabilidade 

&emsp;A aplicação tem uma estrutura de navegação simples e intuitiva, composta por algumas páginas chave. Cada uma delas tem uma função clara, conforme descrito abaixo:

### Home

&emsp;A página principal, ou Home, é a primeira página vista pelos usuários. Ela apresenta um resumo do propósito da aplicação e orienta o usuário sobre como navegar pelas principais funcionalidades, como previsões, logs e visualização de preços.

### New Predict 

&emsp;Na página New Predict, o usuário pode selecionar entre dois modelos de predição: GRU ou LSTM. O usuário também escolhe quantos dias à frente deseja prever. A última previsão realizada e o usuário que a efetuou são exibidos como parte das informações.

### Logs

&emsp;A página Logs permite que o usuário visualize todo o histórico de ações realizadas na plataforma. É possível verificar quem fez login, quem executou previsões, além de qualquer erro que tenha ocorrido.

### Pricing Now

&emsp;A página Pricing exibe um gráfico em tempo real com o preço da moeda. Com base nas previsões feitas, o usuário pode decidir se é mais vantajoso comprar ou vender, recebendo uma recomendação baseada no último cálculo.

## Conclusão

&emsp;O frontend da aplicação foi desenvolvido com um enfoque em funcionalidade e simplicidade. Ao combinar Next.js com Tailwind CSS, foi possível garantir uma aplicação rápida, responsiva e com um design limpo, facilitando a experiência do usuário sem sacrificar a performance ou a clareza das informações.
