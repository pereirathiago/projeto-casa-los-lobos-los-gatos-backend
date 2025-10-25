import cors from 'cors'
import express from 'express'
import 'reflect-metadata'
import swaggerUi from 'swagger-ui-express'
import './container/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import router from './router/index.js'
import swaggerDocs from './swagger.json' with { type: 'json' }

const app = express()

const allowedOrigins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

app.use(cors(options))

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(router)

app.use(errorHandler)

export default app
