import { container } from 'tsyringe'
import { IStorageProvider } from './i-storage-provider.js'
import { LocalStorageProvider } from './implementations/local-storage-provider.js'
import { S3AwsStorageProvider } from './implementations/s3-aws-storage-provider.js'

const diskStorage = {
  local: LocalStorageProvider,
  s3Aws: S3AwsStorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  diskStorage[process.env.DISK || 'local'],
)
