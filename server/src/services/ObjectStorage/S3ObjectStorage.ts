import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import debug from 'debug';
import config from '../../config';
import { IObjectStorage } from './types';

export class S3ObjectStorage implements IObjectStorage {
  private readonly log: debug.Debugger;
  private readonly s3: S3;

  constructor() {
    this.log = debug(S3ObjectStorage.name);
    this.s3 = new S3({
      credentials: {
        accessKeyId: config.nodechef.objectStorage.accessKey,
        secretAccessKey: config.nodechef.objectStorage.secretAccessKey,
      },
      endpoint: config.nodechef.objectStorage.endpoint
      // region: config.nodechef.objectStorage.endpoint
    });
  }

  public async uploadObject(bucket: string, key: string, contentType: string, body: Buffer): Promise<void> {
    this.log('uploadObject (object body not included)', { bucket, key, contentType });

    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    };

    try {
      const output = await this.s3.putObject(params).promise();
      this.log(`Object successfully uploaded`, { key, bucket, output });
    } catch (error) {
      this.log(`Failed to upload object`, { key, bucket }, error);
      throw error;
    }
  }

  public async deleteObject(bucket: string, key: string): Promise<void> {
    const params: S3.DeleteObjectRequest = {
      Key: key,
      Bucket: bucket
    };
    this.log('deleteObject', params);
    
    try {
      const output = await this.s3.deleteObject(params).promise();
      this.log('Object successfully deleted', { params, output });
    } catch (error) {
      this.log(`Failed to delete object`, { key, bucket }, error);
      throw error;
    }
  }

  /**
   * Creates the bucket if it dones't exist.
   */
  public async ensureBucket(bucket: string): Promise<void> {
    this.log(`ensureBucket`, bucket);

    let exists = false;
    try {
      await this.s3.headBucket({ Bucket: bucket }).promise();
      exists = true;
      this.log(`S3 bucket "${bucket}" ensured.`);
    } catch (error) {
      if ((error as AWSError).statusCode === 404) {
        exists = false;        
      }
    }

    if (!exists) {
      try {
        const output = await this.s3.createBucket({ Bucket: bucket });
        this.log(`S3 bucket "${bucket}" created.`, { output });
      } catch (error) {
        this.log(`Failed to create S3 bucket ${bucket}.`, error);
        throw error;
      }
    }
  };
}