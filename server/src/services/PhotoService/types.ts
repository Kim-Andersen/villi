import { EntityPhoto, EntityPhotoInput, LocationId, Photo, PhotoId, VendorId, VendorLocationId } from '../../shared';

export interface IPhotoService {
  findAllVendorPhotos(vendor_id: VendorId): Promise<Photo[]>;
  findAllLocationPhotos(location_id: LocationId): Promise<Photo[]>;
  findAllVendorLocationPhotos(vendor_location_id: VendorLocationId): Promise<Photo[]>;
  addPhotoToEntity(input: EntityPhotoInput): Promise<EntityPhoto>;
  removePhotoFromEntity(input: EntityPhotoInput): Promise<void>;
  addPhoto(filePath: string, { content_type }: { content_type: string }): Promise<Photo>;
  deletePhoto(photoId: PhotoId): Promise<void>;
}