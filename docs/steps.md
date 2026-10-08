# Passo a passo seguindo as aulas

## Estrutura de arquivos

```code
decolagem/
├── .github/
│   └── prompts/
│       ├── backend.prompt.md
│       ├── frontend.prompt.md
│       └── orchestrator.prompt.md
├── node_modules/
├── public/
│   └── index.html
├── src/
├── package-lock.json
├── package.json
├── requests.http
└── SPEC.md
```


## Prompts

2. Configurando os Agentes

- [spec]
```code
# Decolagem - Especificação

## O que o app faz
Permite registrar e visualizar gastos pessoais pelo navegador.

## Interface (Frontend)
- Página única com:
    - Formulário: campo de descrição, campo de valor, botão "Adicionar"
    - Lista de gastos cadastrados com descrição e valor em cada linha
    - Total de gastos exibido no rodapé da lista

## API (Backend)
 - GET /expenses -> retornar todos os gastos
 - POST /expenses -> adicionar um novo gasto

 ## Regras
  - Descrição e valor são obrigatorios
  - Valor deve ser um número positivo
  - Gastos salvos em memória
  - Cada gasto tem: id, description, amount, createdAt
```

- [backend.prompt]
```code
Você é um agente especializado em backend Node.js.
Sua responsabilidade é criar e manter a API do projeto.
Você só cria e edita arquivos dentro da pasta src/.
Você nunca toca em arquivos da pasta public/.

Sempre leia o SPEC.md antes de qualquer ação.
```

- [frontend.prompt]
```code
Você é um agente especializado em front-end.
Sua responsabilidade é criar e manter a interface do projeto.
Você só cria e edita arquivos dentro da pasta public/.
Você nunca toca em arquivos da pasta src/.
Use apenas HTML, CSS inline e JavaScript puro com fetch.
Sem frameworks ou bibliotecas externas.

Sempre leia o SPEC.md antes de qualquer ação.
```

- [orschestrator.prompt]
```code
Você é um agente orquestrador.
Sua responsabilidade é garantir que o back-end e o front-end estão alinhados e funcionando juntos.
Você não cria funcionalidades novas — você revisa, identifica inconsistências e corrige.

Sempre siga essa ordem:
1. Leia o SPEC.md e entenda o contrato do projeto
2. Leia src/server.js e mapeie os campos esperados em cada rota
3. Leia public/app.js e verifique se o front está chamando as rotas corretamente
4. Se encontrar inconsistências, corrija nos arquivos necessários
5. Confirme que front e back estão alinhados
```

3. Criando o Backend com o Agente

- [chat]
```code
#file:backend.prompt.md crie o backend completo
```

4. Criando o Front-end e Utilizando o Stitch

- [stitch](https://stitch.withgoogle.com/)
```code
Página de controle de gastos pessoais chamada Decolagem.
Tem um formulário no topo com dois campos: descrição do gasto e valor em reais.
Abaixo um botão Adicionar.
Depois uma lista de gastos com descrição e valor em cada linha.
No rodapé da lista o total de gastos formatado em reais.
Visual limpo, minimalista, fundo claro, tipografia moderna.
```

Design System

- [frontend-prompt] (incrementa o .md)
```code
...
Siga esse layout como referência visual: formulário no topo com campos de descrição e valor, botão Adicionar, lista de gastos abaixo com descrição e valor formatado em reais em cada linha, total no rodapé. Visual limpo, minimalista, fundo claro.
```

- [chat-imagem-anexada]
```code
#file:frontend.prompt.md crie o frontend completo seguindo o layout da **imagem anexada**.
```

- [chat-fix]
```code
#file:frontend.prompt.md as bordas dos inputs estão coladas uma nas outras precisa de um espaçamento e a borda tem que ser invisível.

Captura de Tela 2026-04-15 às 12.52.02.png
```

- [chat-orchestrator-fix]
```code
#file:orchestrator.prompt.md o frontend e o backend foi criado o backend está na porta 3333, e o frontend eu estou usando o liveserver na porta 5500,  porem eles não estão se comunicando, veja o que está acontecendo e corrija.