import { EntityPhoto, EntityPhotoInput, EntityType, Photo, PhotoId } from '../../shared';

export interface IPhotoService {
  findAllEntityPhotos(entity_type: EntityType, entity_id: number): Promise<Photo[]>;
  addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhoto>;
  removePhotoFromEntity(input: EntityPhotoInput): Promise<void>;
  addPhoto(filePath: string, { content_type }: { content_type: string }): Promise<Photo>;
  deletePhoto(photoId: PhotoId): Promise<void>;
  removeAllEntityPhotos(entity_type: EntityType, entity_id: number): Promise<void>;
}