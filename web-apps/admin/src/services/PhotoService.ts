import { IBackendAPI } from '../api/types';
import { EntityPhoto, LocationId, Photo, PhotoId, PhotoSizes, ProductId, VendorId, VendorLocationId } from '../shared';

type EntityType = 'vendor_id' | 'location_id' | 'vendor_location_id' | 'product_id';
type EntityId = VendorId | LocationId | VendorLocationId | ProductId;

export default class PhotoService {
  public readonly isWorking = this.api.isWorking;

  constructor(private readonly api: IBackendAPI) {}

  public async uploadPhoto(file: File, { sizes }: { sizes: PhotoSizes }): Promise<Photo> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('sizes', JSON.stringify(sizes));

    return this.api.post<Photo>('/photos', null, formData);
  }

  public async getEntityPhotos(entityType: EntityType, entityId: EntityId): Promise<Photo[]> {    
    return this.api.get<Photo[]>(`/photos/${entityType}/${entityId}`);
  }

  public async addEntityPhoto(photoId: PhotoId, entityType: EntityType, entityId: EntityId, options: { type?: string } = {}): Promise<EntityPhoto> {    
    return this.api.post<EntityPhoto>(`/photos/${entityType}/${entityId}/${photoId}`, options);
  }

  public async deleteEntityPhoto(photoId: PhotoId, entityType: EntityType, entityId: EntityId): Promise<void> {
    return this.api.delete(`/photos/${entityType}/${entityId}/${photoId}`);
  }
}
