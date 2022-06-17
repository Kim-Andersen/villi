import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { envVar } from '../../environment';

class S3Helper {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: envVar('NC_OBJECT_STORAGE_KEY'),
        secretAccessKey: envVar('NC_OBJECT_STORAGE_SECRET_KEY')
      },
      endpoint: envVar('NC_OBJECT_STORAGE_ENDPOINT'),
      region: 'eu-west-1'
    });
  }

  public async uploadObject(bucket: string, key: string, body: S3.Body, contentType: string): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    };

    try {
      return this.s3.upload(params).promise();
    } catch (error) {
      console.log(`Failed to upload object to S3`, { key, bucket }, error);
      throw error;
    }
  }

  public deleteObject({ key, bucket }: { key: string; bucket: string }): Promise<S3.DeleteObjectOutput> {
    const params: S3.DeleteObjectRequest = {
      Key: key,
      Bucket: bucket
    };
    
    try {
      return this.s3.deleteObject(params).promise();
    } catch (error) {
      console.log(`Failed to delete object from S3`, { key, bucket }, error);
      throw error;
    }
  }

  /**
   * Creates the bucket if it dones't exist.
   */
  public async ensureBucket(bucket: string): Promise<void> {
    let exists = false;
    try {
      await this.s3.headBucket({ Bucket: bucket }).promise();
      exists = true;
      console.log(`S3 bucket "${bucket}" ensured.`);
    } catch (error) {
      if ((error as AWSError).statusCode === 404) {
        exists = false;        
      }
    }

    if (!exists) {
      try {
        await this.s3.createBucket({ Bucket: bucket });
        console.log(`S3 bucket "${bucket}" created.`);
      } catch (error) {
        console.log(`Failed to create S3 bucket ${bucket}.`, error);
        throw error;
      }
    }
  };
}
const s3Helper = new S3Helper();
export default s3Helper; 