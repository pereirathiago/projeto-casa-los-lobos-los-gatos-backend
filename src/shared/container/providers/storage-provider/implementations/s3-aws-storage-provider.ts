import { S3 } from '@aws-sdk/client-s3'
import upload from '@src/config/upload.js'
import fs from 'fs'
import mime from 'mime'
import { resolve } from 'path'
import { IStorageProvider } from '../i-storage-provider.js'

class S3AwsStorageProvider implements IStorageProvider {
  private client: S3

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.AWS_BUCKET_ENDPOINT || undefined,
      forcePathStyle: true,
    })
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file)

    const fileContent = await fs.promises.readFile(originalName)

    const ContentType = mime.getType(originalName)

    await this.client.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    })

    await fs.promises.unlink(originalName)

    return file
  }

  get url(): string {
    return process.env.APP_S3_URL
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
    })
  }
}

export { S3AwsStorageProvider }
