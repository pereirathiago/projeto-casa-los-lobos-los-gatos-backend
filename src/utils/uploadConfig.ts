import crypto from 'crypto'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Diretório de upload
const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'animals')

// Criar diretório se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`
    const ext = path.extname(file.originalname)
    cb(null, `animal-${uniqueSuffix}${ext}`)
  },
})

// Filtro de tipos de arquivo
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    cb(null, true)
  } else {
    const error = new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)')
    cb(error)
  }
}

// Configuração do multer
export const uploadAnimalPhotos = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
})
