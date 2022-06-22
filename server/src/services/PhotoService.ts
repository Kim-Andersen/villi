import debug from 'debug';
import { unlink } from 'fs-extra';
import sharp from 'sharp';
import { IPhotosRepo } from '../database/repositories/PhotosRepo';
import photoHelper from '../shared/photoHelper';
import { Photo, PhotoId } from '../shared/types';
import { IObjectStorage } from './types';

type PhotoCreationInfo = Pick<Photo, 'bucket' | 'type' | 'sizes'> & { 
  /**
   * Path to the image file.
   */
   filePath: string;
 };

export interface IPhotoService {
  addPhoto({ bucket, filePath, type, sizes }: PhotoCreationInfo): Promise<Photo>;
  deletePhoto(photoId: PhotoId): Promise<void>;
}

export default class PhotoService implements IPhotoService {
  private readonly log: debug.Debugger;

  constructor(private readonly photosRepo: IPhotosRepo, private readonly objectStorage: IObjectStorage) {
    this.log = debug(PhotoService.name);
  }

  public async addPhoto({ bucket, filePath, type, sizes }: PhotoCreationInfo): Promise<Photo> {
    this.log('addPhoto', { bucket, filePath, type, sizes });
    const uploadedKeys: string[] = [];
    
    const reservedPhotoId = await this.photosRepo.reservePhotoId();
    this.log('reservedPhotoId', reservedPhotoId);

    const key = `photo_${reservedPhotoId}.jpg`;
    this.log('key', key);

    try {
      await Promise.all(sizes.map(async size => {
        const width = photoHelper.getPhotoSize(size);
        const start = Date.now();
        const buffer = await sharp(filePath)
          .jpeg()
          .resize(width)
          .toBuffer();
        const duration = `${Date.now() - start} ms`;
        this.log(`Processing photo size ${size} took ${duration}`);

        await this.objectStorage.uploadObject(bucket, photoHelper.getFileName(key, size), type, buffer);
        uploadedKeys.push(key);
      }));
      
      const photo = await this.photosRepo.create({ id: reservedPhotoId, key, type, bucket, sizes });
      return photo;
    } catch (error) {
      this.log(`Failed to add photo`, error);
      this.log('Cleaning up after failure');
      
      await this.photosRepo.deleteByKey(key);
      this.log('Removed photo entry from the database');

      // Clean up failed attempt.
      await Promise.all(uploadedKeys.map(async key => {
        await this.objectStorage.deleteObject(bucket, key);
        this.log('Removed object with key ${key} from S3');
      }));
      
      throw error;
    } finally {
      await unlink(filePath); // Delete uploaded file.
    }
  }

  /**
   * Deletes a photo and removes its corresponding database entity.
   * @returns
   * `true` if the photo was succesfully deleted.
   * 
   * `false` if not found.
   */
  public async deletePhoto(photoId: PhotoId): Promise<void> {
    this.log(`Delete photo id ${photoId}`);

    const photo = await this.photosRepo.findById(photoId);
    const { id, bucket, sizes, key } = photo;

    // Delete all photo variants (sizes).
    await Promise.all(sizes.map(size => {
      this.log(`Deleting photo id ${id}, size ${size} from bucket ${bucket}`);
      return this.objectStorage.deleteObject(bucket, photoHelper.getFileName(key, size));
    }));

    await this.photosRepo.deleteById(photo.id);
  }
}
