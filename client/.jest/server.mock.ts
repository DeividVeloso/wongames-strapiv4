global.fetch = require('node-fetch')

import { server } from '../src/utils/mockServer/server'

beforeAll(() => {
  //fica escutando todas as chamadas nos testes
  server.listen()
})

beforeEach(() => {
  //Reseta todos os handler a cada teste para não ter
  // a mesma resposta
  server.resetHandlers()
})

afterAll(() => {
  // Fecha o server e limpa os testes
  server.close()
})
