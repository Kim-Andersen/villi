import { EntityPhotoDetails, EntityPhotoInput, EntityType, LocationId, Photo, PhotoId, ProductId, VendorId, VendorLocationId } from '../../shared';


export type EntityId = VendorId | LocationId | VendorLocationId | ProductId;
export interface IPhotoService {
  findAllEntityPhotos(entityType: EntityType, entityId: EntityId): Promise<EntityPhotoDetails[]>;
  addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhotoDetails>;
  removePhotoFromEntity(input: EntityPhotoInput): Promise<void>;
  addPhoto(filePath: string, { content_type }: { content_type: string }): Promise<Photo>;
  deletePhoto(photoId: PhotoId): Promise<void>;
}