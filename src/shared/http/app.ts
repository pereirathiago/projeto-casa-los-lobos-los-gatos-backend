import upload from '@config/upload.js'
import '@shared/container/index.js'
import swaggerDocs from '@src/swagger.json' with { type: 'json' }
import cors from 'cors'
import express from 'express'
import 'reflect-metadata'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'

const app = express()

const allowedOrigins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

app.use(cors(options))

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/animals', express.static(`${upload.tmpFolder}/animals`))

app.use(routes)

app.use(errorHandler)

export default app
