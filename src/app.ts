import 'reflect-metadata'
import './container'
import express from 'express'
import cors from 'cors'
import router from './router'
import { errorHandler } from './middlewares/errorHandler'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'

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
