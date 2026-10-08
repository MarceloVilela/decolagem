const API_URL = 'http://localhost:3333/expenses'

const form = document.querySelector('#expense-form')
const descriptionInput = document.querySelector('#description')
const amountInput = document.querySelector('#amount')
const expensesList = document.querySelector('#expenses-list')
const totalValue = document.querySelector('#total-value')
const expensesCount = document.querySelector('#expenses-count')
const formMessage = document.querySelector('#form-message')
const submitButton = form.querySelector('button[type="submit"]')

function parseAmount(value) {
  if (typeof value !== 'string') {
    return Number(value)
  }

  const trimmedValue = value.trim()
  if (trimmedValue === '') {
    return Number.NaN
  }

  if (trimmedValue.includes(',') && trimmedValue.includes('.')) {
    const decimalSeparator =
      trimmedValue.lastIndexOf(',') > trimmedValue.lastIndexOf('.') ? ',' : '.'
    const thousandsSeparator = decimalSeparator === ',' ? '.' : ','
    const normalizedValue = trimmedValue
      .replaceAll(thousandsSeparator, '')
      .replace(decimalSeparator, '.')
    return Number(normalizedValue)
  }

  if (trimmedValue.includes(',')) {
    return Number(trimmedValue.replace(',', '.'))
  }

  return Number(trimmedValue)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function setMessage(message, isError = false) {
  formMessage.textContent = message
  formMessage.classList.toggle('success', !isError && message !== '')
  formMessage.style.color = isError ? '#d93d5d' : '#2f7d5b'
}

function renderExpenses(expenses) {
  expensesList.innerHTML = ''

  if (expenses.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'empty-state'
    emptyItem.textContent = 'Nenhum gasto registrado ainda.'
    expensesList.appendChild(emptyItem)
  }

  expenses.forEach((expense) => {
    const item = document.createElement('li')
    item.className = 'expense-item'

    const description = document.createElement('span')
    description.className = 'expense-description'
    description.textContent = expense.description

    const amount = document.createElement('span')
    amount.className = 'expense-amount'
    amount.textContent = formatCurrency(expense.amount)

    item.append(description, amount)
    expensesList.appendChild(item)
  })

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  )
  totalValue.textContent = formatCurrency(total)
  expensesCount.textContent = `${expenses.length} ${expenses.length === 1 ? 'item' : 'itens'}`
}

async function loadExpenses() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Não foi possível carregar os gastos.')
    }

    const expenses = await response.json()
    renderExpenses(expenses)
  } catch (error) {
    setMessage(error.message, true)
  }
}

async function addExpense(event) {
  event.preventDefault()
  setMessage('')

  const payload = {
    description: descriptionInput.value.trim(),
    amount: parseAmount(amountInput.value),
  }

  const isValid =
    payload.description !== '' &&
    Number.isFinite(payload.amount) &&
    payload.amount > 0
  if (!isValid) {
    setMessage('Informe uma descrição e um valor maior que zero.', true)
    return
  }

  submitButton.disabled = true
  submitButton.textContent = 'Adicionando...'

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || 'Não foi possível adicionar o gasto.')
    }

    form.reset()
    descriptionInput.focus()
    setMessage('Gasto adicionado com sucesso!')
    await loadExpenses()
  } catch (error) {
    setMessage(error.message, true)
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Adicionar'
  }
}

form.addEventListener('submit', addExpense)

loadExpenses()
