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