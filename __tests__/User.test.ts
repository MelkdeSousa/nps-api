import request from 'supertest'
import app from '../src/app'
import connection from '../src/database'

describe('Users', async () => {
  beforeAll(async () => {
    const connectionCreated = await connection()
    await connectionCreated.runMigrations()
  })

  it('Should be able to create a new user', async () => {
    const user = {
      name: 'Ludie',
      email: 'luide@hotmail.com',
    }

    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(201)
  })

  it('Should not be able to create a user with exists email', async () => {
    const user = {
      name: 'Ludie',
      email: 'luide@hotmail.com',
    }

    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(400)
  })
})
