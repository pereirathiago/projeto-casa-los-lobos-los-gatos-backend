import crypto from 'crypto'
import multer from 'multer'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tmpFolder = resolve(__dirname, '..', '..', 'tmp')

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(16).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    },
  }),
}
