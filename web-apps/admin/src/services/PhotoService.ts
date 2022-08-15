import { IBackendAPI } from '../api/types';
import { EntityPhotoDetails, EntityType, Photo, PhotoId, PhotoSizes } from '../shared';
import snackbarService from '../snackbar/snackbarService';

export default class PhotoService {
  public readonly isWorking = this.api.isWorking;

  constructor(private readonly api: IBackendAPI) {}

  public async uploadPhoto(file: File | null, { sizes, url }: { sizes: PhotoSizes; url?: string; }): Promise<Photo> {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('sizes', JSON.stringify(sizes));
    if (url) {
      formData.append('url', url);
    }

    return this.api.post<Photo>('/photos', null, formData);
  }

  public async getEntityPhotos(entityType: EntityType, entityId: number): Promise<Photo[]> {    
    return this.api.get<Photo[]>(`/photos/${entityType}/${entityId}`);
  }

  public async addEntityPhoto(photoId: PhotoId, entityType: EntityType, entityId: number, options: { type?: string } = {}): Promise<EntityPhotoDetails> {    
    return this.api.post<EntityPhotoDetails>(`/photos/${entityType}/${entityId}/${photoId}`, options);
  }

  public async deleteEntityPhoto(entityType: EntityType, entityId: number, photoId: PhotoId): Promise<void> {
    await this.api.delete(`/photos/${entityType}/${entityId}/${photoId}`);
    snackbarService.showSnackbar('Photo deleted.');
  }
}
