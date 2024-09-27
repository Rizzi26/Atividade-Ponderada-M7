---
sidebar_position: 1
slug: "/banco"
---

# Documentação do Banco de Dados

## Introdução

&emsp;Nesta seção, detalharei a estrutura e a configuração do banco de dados utilizado no projeto. Utilizei PostgreSQL como sistema de gerenciamento de banco de dados relacional, com o FastAPI para a construção da API e o SDK do supabase para manipulação de dados.

## Tabelas Existentes

### Tabela `users`:

&emsp;A tabela users armazena informações dos usuários do sistema.

- **id:** Identificador único do usuário (chave primária).
- **username:** Nome de usuário.
- **password:** Senha do usuário.

```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  username text,
  password text
);
```

### Tabela `predict`:

&emsp;A tabela predict armazena previsões feitas pelos usuários com base nos modelos utilizados.

- **id:** Identificador único da previsão (chave primária).
- **username_predict:** Nome de usuário que fez a previsão.
- **date:** Data em que a previsão foi realizada.
- **forecast:** Resultado da previsão (true/false).
- **forecast_result:** Resultado completo da previsão em formato JSON.
- **model:** Modelo utilizado para a previsão.
- **user_id:** Identificador do usuário ao qual a previsão está associada (chave estrangeira referenciando `users.id`).

```sql
CREATE TABLE predict (
  id serial PRIMARY KEY,
  username_predict text,
  date text,
  forecast bool,
  forecast_result json,
  model text,
  user_id integer REFERENCES users (id)
);
```

### Tabela `logs`:

&emsp;A tabela logs armazena os registros de ações realizadas pelos usuários.

- **id:** Identificador único do log (chave primária).
- **date:** Data em que a ação foi registrada.
- **username_log:** Nome do usuário que executou a ação.
- **action:** Descrição da ação realizada.
- **user_id:** Identificador do usuário associado à ação (chave estrangeira referenciando `users.id`).

```sql
CREATE TABLE logs (
  id serial PRIMARY KEY,
  date text,
  username_log text,
  action text,
  user_id integer REFERENCES users (id)
);
```

## Representação Visual do Schema

&emsp;Abaixo está a representação visual do schema do banco de dados utilizando a sintaxe ERD (Entity-Relationship Diagram).

```sql
erDiagram
    USERS {
        int id
        text username
        text password
    }
    PREDICT {
        int id
        text username_predict
        text date
        bool forecast
        json forecast_result
        text model
        int user_id
    }
    LOGS {
        int id
        text date
        text username_log
        text action
        int user_id
    }

    USERS ||--o{ PREDICT : "realiza"
    USERS ||--o{ LOGS : "gera"
```

### Explicação das Relações

- **USERS e PREDICT:** Um usuário pode realizar múltiplas previsões, mas cada previsão está associada a um único usuário. Esta relação é representada como U`SERS ||--o{ PREDICT`.

- **USERS e LOGS:** Um usuário pode gerar múltiplos logs de ação, mas cada log está associado a um único usuário. Esta relação é representada como `USERS ||--o{ LOGS`.

&emsp;O diagrama acima mostra como as tabelas estão conectadas umas às outras através de chaves estrangeiras, fornecendo uma visão clara de como os dados fluem entre as tabelas e como elas se relacionam.