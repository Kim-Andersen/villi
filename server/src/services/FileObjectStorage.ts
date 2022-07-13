import debug from 'debug';
import { createWriteStream, mkdir, pathExists, unlink } from 'fs-extra';
import { join, normalize } from 'path';
import config from '../config';
import { IObjectStorage } from './types';

export class FileObjectStorage implements IObjectStorage {
  private log: debug.Debugger;

  constructor() {
    this.log = debug(FileObjectStorage.name);
  }

  public async uploadObject(bucket: string, key: string, contentType: string, buffer: Buffer): Promise<void> {
    this.log('uploadObject', { bucket, key, contentType });
    await createWriteStream(this.getFilePath(bucket, key)).write(buffer);
  }

  public async deleteObject(bucket: string, key: string): Promise<void> {
    this.log('deleteObject', { bucket, key });
    return unlink(this.getFilePath(bucket, key));
  }

  public async ensureBucket(bucket: string): Promise<void> {
    this.log('ensureBucket', { bucket });
    const path = normalize(join(config.publicDir, bucket));
    if (!(await pathExists(path))) {
      return mkdir(path);
    }
  }

  private getFilePath(bucket: string, fileName: string): string {
    return normalize(join(config.publicDir, bucket, fileName));
  }
}