const test = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('node:http')

const { app } = require('./server')

function startTestServer() {
  return new Promise((resolve) => {
    const server = createServer(app)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` })
    })
  })
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const body = response.headers
    .get('content-type')
    ?.includes('application/json')
    ? await response.json()
    : await response.text()

  return { status: response.status, body, headers: response.headers }
}

test('GET /expenses retorna a lista vazia inicialmente', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const result = await requestJson(baseUrl, '/expenses')
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, [])
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('POST /expenses adiciona um gasto e retorna o gasto salvo', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const payload = { description: 'Almoço', amount: 25.5 }
    const result = await requestJson(baseUrl, '/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    assert.equal(result.status, 201)
    assert.equal(result.body.description, payload.description)
    assert.equal(result.body.amount, payload.amount)
    assert.match(
      result.body.id,
      /^expense-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
    assert.ok(result.body.createdAt)

    const listResult = await requestJson(baseUrl, '/expenses')
    assert.equal(listResult.status, 200)
    assert.equal(listResult.body.length, 1)
    assert.deepEqual(listResult.body[0], result.body)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('POST /expenses valida descrição e valor', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const invalidCases = [
      { payload: { description: '', amount: 10 }, expectedStatus: 400 },
      { payload: { description: 'Cinema', amount: 0 }, expectedStatus: 400 },
      { payload: { description: 'Cinema', amount: -5 }, expectedStatus: 400 },
      { payload: { description: 'Cinema' }, expectedStatus: 400 },
      { payload: { amount: 10 }, expectedStatus: 400 },
    ]

    for (const { payload, expectedStatus } of invalidCases) {
      const result = await requestJson(baseUrl, '/expenses', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      assert.equal(result.status, expectedStatus)
      assert.match(result.body.error, /description|valor|obrig/)
    }
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('POST /expenses aceita valores decimais com vírgula ou ponto', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const validCases = [
      {
        payload: { description: 'Almoço', amount: '10,50' },
        expectedAmount: 10.5,
      },
      {
        payload: { description: 'Cinema', amount: 10.5 },
        expectedAmount: 10.5,
      },
    ]

    for (const { payload, expectedAmount } of validCases) {
      const result = await requestJson(baseUrl, '/expenses', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      assert.equal(result.status, 201)
      assert.equal(result.body.amount, expectedAmount)
    }
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('POST /expenses rejeita body não JSON válido', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const result = await requestJson(baseUrl, '/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json}',
    })

    assert.equal(result.status, 400)
    assert.equal(result.body.error, 'Corpo da requisição inválido')
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
test('API permite requisições de origem diferente para GET e POST', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const options = {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://127.0.0.1:5501',
        'Access-Control-Request-Method': 'POST',
      },
    }

    const preflight = await requestJson(baseUrl, '/expenses', options)
    assert.equal(preflight.status, 204)
    assert.equal(preflight.body, '')

    const response = await requestJson(baseUrl, '/expenses', {
      method: 'GET',
      headers: { Origin: 'http://127.0.0.1:5501' },
    })

    assert.equal(response.status, 200)
    assert.equal(Array.isArray(response.body), true)
    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'http://127.0.0.1:5501',
    )
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
