export interface IObjectStorage {
  uploadObject(bucket: string, key: string, contentType: string, body: Buffer): Promise<void>;
  deleteObject(bucket: string, key: string): Promise<void>;
  ensureBucket(bucket: string): Promise<void>;
}