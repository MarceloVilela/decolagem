# Decolagem

Aplicação para registrar e acompanhar gastos pessoais no navegador.

## Funcionalidades

- Formulário com descrição e valor do gasto
- Cadastro de gastos por meio da API
- Listagem dos gastos registrados
- Cálculo automático do total
- Formatação de valores em reais
- Persistência em memória durante a execução da aplicação

## Tecnologias

- Node.js
- Express
- HTML
- CSS inline
- JavaScript puro
- Testes nativos com Node.js

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Executar a aplicação

Inicie o backend:

```bash
npm start
```

O servidor estará disponível em:

```text
http://localhost:3333
```

Para acessar a interface, use um servidor estático na pasta `public`, por exemplo o Live Server na porta `5501`.

## API

### GET /expenses

Retorna todos os gastos cadastrados.

Resposta:

```json
[
  {
    "id": "expense-...",
    "description": "Almoço",
    "amount": 10.5,
    "createdAt": "2026-10-08T00:00:00.000Z"
  }
]
```

### POST /expenses

Adiciona um novo gasto.

Corpo da requisição:

```json
{
  "description": "Almoço",
  "amount": "10,50"
}
```

O campo `amount` também aceita `10.50`.

Regras:

- `description` é obrigatório
- `amount` deve ser um número positivo
- Gastos são armazenados somente na memória durante a execução

Possíveis respostas:

- `201 Created`: gasto criado
- `400 Bad Request`: dados inválidos
- `404 Not Found`: rota inexistente

## Testes

```bash
npm test
```

Os testes cobrem:

- listagem inicial
- criação de gastos
- validação de descrição
- valores positivos
- valores decimais com ponto e vírgula
- JSON inválido
- CORS para o Live Server

## Acesso ao código-fonte

A especificação completa está em [SPEC.md](SPEC.md).

* Projeto do curso: https://app.rocketseat.com.br/jornada/desenvolvimento-ai-native-copilot-mcp-agentes-tasks-e-skills/conteudos?levelSlug=aulas-e-questionarios
* GitHub Copilot
