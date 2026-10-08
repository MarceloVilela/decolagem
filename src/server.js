const express = require('express')
const { randomUUID } = require('node:crypto')
const path = require('node:path')

const app = express()
const expenses = []

const allowedOrigins = ['http://127.0.0.1:5501', 'http://localhost:5501']

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/expenses', (req, res) => {
  res.json(expenses)
})

app.post('/expenses', (req, res) => {
  const { description, amount } = req.body ?? {}

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'A descrição é obrigatória' })
  }

  let numericAmount = amount

  if (typeof amount === 'string') {
    const trimmedAmount = amount.trim()

    if (trimmedAmount.includes(',') && trimmedAmount.includes('.')) {
      const decimalSeparator =
        trimmedAmount.lastIndexOf(',') > trimmedAmount.lastIndexOf('.')
          ? ','
          : '.'
      const thousandsSeparator = decimalSeparator === ',' ? '.' : ','
      numericAmount = Number(
        trimmedAmount
          .replaceAll(thousandsSeparator, '')
          .replace(decimalSeparator, '.'),
      )
    } else if (trimmedAmount.includes(',')) {
      numericAmount = Number(trimmedAmount.replace(',', '.'))
    } else {
      numericAmount = Number(trimmedAmount)
    }
  }

  if (
    typeof numericAmount !== 'number' ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return res
      .status(400)
      .json({ error: 'O valor deve ser um número positivo' })
  }

  const expense = {
    id: `expense-${randomUUID()}`,
    description: description.trim(),
    amount: numericAmount,
    createdAt: new Date().toISOString(),
  }

  expenses.push(expense)
  return res.status(201).json(expense)
})

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Corpo da requisição inválido' })
  }

  return next(error)
})

if (require.main === module) {
  const port = Number(process.env.PORT) || 3333
  app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}`)
  })
}

module.exports = { app, expenses }
