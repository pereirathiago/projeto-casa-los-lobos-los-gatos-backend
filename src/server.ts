import 'reflect-metadata'
import app from './app.js'
import { config } from './config/index.js'

app.listen(config.server.port, '0.0.0.0', () => {
  console.log(`Server is running on port ${config.server.port}`)
  console.log(`Environment: ${config.server.nodeEnv}`)
})
