import { EntityPhoto, EntityPhotoInput, LocationId, Photo, PhotoId, ProductId, VendorId, VendorLocationId } from '../../shared';

export type EntityType = 'vendor_id' | 'location_id' | 'vendor_location_id' | 'product_id';
export type EntityId = VendorId | LocationId | VendorLocationId | ProductId;
export interface IPhotoService {
  findAllEntityPhotos(entityType: EntityType, entityId: EntityId): Promise<Photo[]>;
  addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhoto>;
  removePhotoFromEntity(input: EntityPhotoInput): Promise<void>;
  addPhoto(filePath: string, { content_type }: { content_type: string }): Promise<Photo>;
  deletePhoto(photoId: PhotoId): Promise<void>;
}