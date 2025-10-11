import 'reflect-metadata'
import app from './app'
import { config } from './config'

app.listen(config.server.port, '0.0.0.0', () => {
  console.log(`Server is running on port ${config.server.port}`)
  console.log(`Environment: ${config.server.nodeEnv}`)
})
