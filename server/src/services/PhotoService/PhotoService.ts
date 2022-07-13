import debug from 'debug';
import { unlink } from 'fs-extra';
import sharp from 'sharp';
import { IEntityPhotoModel, IPhotoModel } from '../../models';
import { EntityPhoto, EntityPhotoInput, EntityType, Photo, PhotoId, photoInputSchema, PhotoSize } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import { IObjectStorage } from '../types';

export default class PhotoService {
  private readonly bucket = 'photos';
  private readonly sizes: PhotoSize[] = ['sm', 'md'];
  private readonly log = debug(PhotoService.name);
  
  constructor(
    private readonly photoModel: IPhotoModel, 
    private readonly entityPhotoModel: IEntityPhotoModel, 
    private readonly objectStorage: IObjectStorage) {
    this.log('initialize');
    this.objectStorage.ensureBucket(this.bucket);
  }

  public findAllEntityPhotos(entity_id: number, entity_type: EntityType): Promise<Photo[]> {
    this.log('findAllEntityPhotos', { entity_id, entity_type });
    return this.entityPhotoModel.findAllEntityPhotos(entity_id, entity_type);
  }
  
  public async addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhoto> {
    this.log('addPhotoToEntity', { input });
    return this.entityPhotoModel.insert(input);
  
  }
  public async removePhotoFromEntity(input: EntityPhotoInput): Promise<void> {
    this.log('removePhotoFromEntity', { input });
    return this.entityPhotoModel.delete(input);
  }

  public async addPhoto(filePath: string, { content_type }: { content_type: string }): Promise<Photo> {
    const log = this.log.extend('addPhoto');

    const { bucket, sizes } = this;
    log('addPhoto', { filePath, sizes, bucket, content_type });

    /**
     * Create a unique key for the photo by using a reserved photo db id.
     */
    const reservedPhotoId = await this.photoModel.reservePhotoId();
    const key = `photo_${reservedPhotoId}.jpg`;

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
        log(`Processing photo size ${size} took ${duration}`);

        await this.objectStorage.uploadObject(bucket, photoHelper.getFileName(key, size), content_type, buffer);
        uploadedKeys.push(key);
      }));
      
      const photoInput = photoInputSchema.parse({ bucket, sizes, content_type, key });
      log('photoInput', photoInput);

      return await this.photoModel.insertPhotoWithReservedId(reservedPhotoId, photoInput);
    } catch (error) {
      log(`Failed to add photo`, error);
      log('Cleaning up after failure');
      
      await this.photoModel.deleteByKey(key);
      log('Removed photo entry from the database');

      // Clean up failed attempt.
      await Promise.all(uploadedKeys.map(async key => {
        await this.objectStorage.deleteObject(bucket, key);
        log('Removed object with key ${key} from S3');
      }));
      
      throw error;
    } finally {
      log('Deleting file', { filePath });
      await unlink(filePath); // Delete uploaded file.
    }
  }

  public async deletePhoto(photoId: PhotoId): Promise<void> {
    this.log('deletePhoto', { photoId });

    const photo = await this.photoModel.findById(photoId);
    const { id, bucket, sizes, key } = photo;

    // Delete all photo variants (sizes).
    await Promise.all(sizes.map(size => {
      this.log(`Deleting photo id ${id}, size ${size} from object storage bucket ${bucket}`);
      return this.objectStorage.deleteObject(bucket, photoHelper.getFileName(key, size));
    }));

    await this.photoModel.deleteById(id as PhotoId);
  }
}