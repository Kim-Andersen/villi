import debug from 'debug';
import { unlink } from 'fs-extra';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import db from '../../database';
import photoHelper from '../../shared/photoHelper';
import { Photo, PhotoId, PhotoSize } from '../../shared/types';
import s3Helper from './s3Helper';

const log = debug('photoService');

type PhotoCreationInfo = {
  /**
   * S3 bucket.
   */
  bucket: string;
  /**
   * Path to the image file.
   */
  filePath: string;
  /**
   * MIME content type
   */
  contentType: string;
  /**
   * Which sizes to generate.
   */
  sizes: PhotoSize[];
};

class PhotoService {
  public async addPhoto({ bucket, filePath ,contentType, sizes }: PhotoCreationInfo): Promise<Photo> {
    const uniqueKey = uuidv4();

    const uploadedKeys: string[] = [];

    try {
      await Promise.all(sizes.map(async size => {
        const width = photoHelper.getPhotoSize(size);
        const start = Date.now();
        const buffer = await sharp(filePath)
          .jpeg()
          .resize(width)
          .toBuffer();
        const duration = `${Date.now() - start} ms`;
        console.log({ size, duration });
        
        const key = photoHelper.formatKey(uniqueKey, size);
        // const objectBody = Buffer.from(buffer.toString('base64').replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const uploaded = await s3Helper.uploadObject(bucket, key, buffer, contentType);
        if (uploaded) {
          uploadedKeys.push(key);
        } else {
          throw new Error(`Failed to add photo.`);
        }
      }));
      
      const params = [uniqueKey, contentType, bucket, `{${sizes?.join(',')}}`];
      const result = await db.query(`INSERT INTO photos(key, type, bucket, sizes) VALUES ($1,$2,$3,$4) RETURNING *`, params);

      // Delete uploaded file.
      await unlink(filePath);

      return result.rows[0] as Photo;
    } catch (error) {
      console.log(`Failed to add photo`, error);
      console.group('Cleaning up...');
      
      const result = await db.query(`delete from photos where key = ${uniqueKey}`);
      if (result.rowCount === 1) {
        console.log('Removed photo entry from the database');
      } else {
        console.log('No photo entry found in the database');
      }

      // Clean up failed attempt.
      await Promise.all(uploadedKeys.map(async key => {
        await s3Helper.deleteObject({ key, bucket });
        console.log('Removed object with key ${key} from S3');
      }));
      
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Loads the the photo from the database.
   */
  public async getPhoto(photoId: PhotoId): Promise<Photo | null> {
    const result = await db.query(`select p.*, to_json(p.sizes) as sizes from photos p where id = ${photoId}`);
    if (result.rowCount === 1) {
      return result.rows[0] as Photo;
    } else if (result.rowCount === 0) {
      return null;
    } else {
      console.log(`Failed to get photo id ${photoId} from db`, result);
      throw new Error(`Failed to get photo id ${photoId} from db`);
    }
  }


  /**
   * Deletes a photo and removes its corresponding database entity.
   * @returns
   * `true` if the photo was succesfully deleted.
   * 
   * `false` if not found.
   */
  public async deletePhoto(photoId: PhotoId): Promise<boolean> {
    log(`Delete photo id ${photoId}`);

    const photo = await this.getPhoto(photoId);
    if (!photo ) {
      log(`Photo id ${photoId} to delete not found.`);
      return false;
    }

    await Promise.all(photo.sizes.map(size => {
      log(`Deleting photo id ${photo.id}, size ${size}`);
      return s3Helper.deleteObject({ key: photoHelper.formatKey(photo.key, size), bucket: photo.bucket });
    }));

    await db.query(`delete from photos where id = ${photo.id}`);
    return true;
  }
}

const photoService = new PhotoService();
export default photoService;