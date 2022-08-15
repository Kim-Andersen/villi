import debug from 'debug';
import { unlink } from 'fs-extra';
import sharp from 'sharp';
import { IEntityPhotoModel, IPhotoModel } from '../../models';
import { EntityPhotoDetails, EntityPhotoInput, entityPhotoSearchSchema, EntityType, Photo, PhotoId, photoInputSchema, PhotoSizes } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import { IObjectStorage } from '../ObjectStorage/types';
import { EntityId, IPhotoService } from './types';

export default class PhotoService implements IPhotoService {
  private readonly bucket = 'villi-photos';
  private readonly log = debug(PhotoService.name);
  
  constructor(
    private readonly photoModel: IPhotoModel, 
    private readonly entityPhotoModel: IEntityPhotoModel, 
    private readonly objectStorage: IObjectStorage) {
    this.log('initialize');

    this.log(`Ensuring bucket "${this.bucket}"`)
    this.objectStorage.ensureBucket(this.bucket);
  }

  public async findAllEntityPhotos(entityType: EntityType, entityId: EntityId): Promise<EntityPhotoDetails[]> {
    return this.entityPhotoModel.findAll(entityPhotoSearchSchema.parse({ entityType, entityId }));
  }
  
  /**
   * Associate a photo to an entity, ie. a vendor or a location.
   */
  public async addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhotoDetails> {
    this.log('addPhotoToEntity', { input });
    return this.entityPhotoModel.insert(input);
  }

  /**
   * Remove a photo from an entity, ie. a vendor or a location.
   */
  public async removePhotoFromEntity(input: EntityPhotoInput): Promise<void> {
    this.log('removePhotoFromEntity', { input });

    await this.entityPhotoModel.delete(input);

    // Delete photo if it has no remaining entities referencing it.
    const refCount = await this.entityPhotoModel.countPhotoEntities(input.photo_id as PhotoId);
    this.log({ refCount });

    if (refCount === 0) {
      this.log('Deleting photo as no entities are referencing it.', { photo_id: input.photo_id })
      await this.deletePhoto(input.photo_id as PhotoId);
    }
  }

  public async addPhoto(filePath: string, { content_type, sizes }: { content_type: string, sizes: PhotoSizes }): Promise<Photo> {
    const log = this.log.extend('addPhoto');

    const bucket = this.bucket;
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