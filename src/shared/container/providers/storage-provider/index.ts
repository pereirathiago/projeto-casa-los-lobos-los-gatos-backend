import { container } from 'tsyringe'
import { IStorageProvider } from './i-storage-provider.js'
import { LocalStorageProvider } from './implementations/local-storage-provider.js'

const diskStorage = {
  local: LocalStorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  diskStorage[process.env.DISK || 'local'],
)
