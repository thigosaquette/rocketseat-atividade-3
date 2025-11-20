# FindAFriend API

API REST para sistema de adoção de animais desenvolvida com Node.js, Fastify, Knex e TypeScript.

## Tecnologias

- Node.js
- Fastify
- Knex
- TypeScript
- Vitest

## Funcionalidades

- Cadastro de ORG (organização)
- Login de ORG
- Cadastro de pet
- Listagem de pets por cidade
- Filtragem de pets por características
- Visualização de detalhes de um pet

## Regras de Negócio

- A informação da cidade é obrigatória para listar os pets
- Uma ORG deve, obrigatoriamente, ter um endereço e um número de WhatsApp
- Todo pet cadastrado precisa estar vinculado a uma ORG
- Todos os filtros de características do pet, com exceção da cidade, são opcionais
- Para que uma ORG tenha acesso administrativo à aplicação, ela deve estar logada

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:

```bash
cp .env.example .env
```

## Executar Migrations

```bash
npm run knex:migrate
```

## Executar em Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

