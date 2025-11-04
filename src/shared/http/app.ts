import '@shared/container/index.js'
import swaggerDocs from '@src/swagger.json' with { type: 'json' }
import cors from 'cors'
import express from 'express'
import path from 'path'
import 'reflect-metadata'
import swaggerUi from 'swagger-ui-express'
import { fileURLToPath } from 'url'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const allowedOrigins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

app.use(cors(options))

app.use(express.json())

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', '..', '..', 'uploads')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(routes)

app.use(errorHandler)

export default app
