import 'reflect-metadata'
import './container'
import express from 'express'
import cors from 'cors'
import router from './router'

const app = express()

const allowedOrigins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

app.use(cors(options))

app.use(express.json())

app.use(router)

export default app
