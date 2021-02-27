import request from 'supertest'
import app from '../src/app'
import connection from '../src/database'

describe('Surveys', async () => {
  beforeAll(async () => {
    const connectionCreated = await connection()
    await connectionCreated.runMigrations()
  })

  it('Should be able to create a new survey', async () => {
    const survey = {
      title: 'Soluta magnam consequatur labore voluptatem est.',
      description: 'Ut mollitia ipsam non.',
    }

    const response = await request(app).post('/surveys').send(survey)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('Should be able to get all surveys', async () => {
    const survey = {
      title: 'Soluta magnam consequatur labore voluptatem est.',
      description: 'Ut mollitia ipsam non.',
    }

    await request(app).post('/surveys').send(survey)

    const response = await request(app).get('/surveys')

    expect(response.body).toHaveLength(2)
  })
})
