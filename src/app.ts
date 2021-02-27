import * as dotenv from 'dotenv'
import express from 'express'
import 'reflect-metadata'
import connection from './database'
import routes from './routes'

dotenv.config()

connection()

const app = express()

app.use(express.json())
app.use(routes)

export default app
