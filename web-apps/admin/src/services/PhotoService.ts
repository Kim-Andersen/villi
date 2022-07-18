import { IBackendAPI } from '../api/types';
import { EntityPhoto, EntityType, Photo, PhotoId } from '../shared';

export default class PhotoService {
  constructor(private readonly api: IBackendAPI) {}

  public async uploadPhoto(file: File): Promise<Photo> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.api.post<Photo>('/photos', null, formData);
  }

  public async addEntityPhotos(entity_type: EntityType, entity_id: number, photoId: PhotoId): Promise<EntityPhoto> {
    return this.api.post<EntityPhoto>(`/photos/${entity_type}/${entity_id}/${photoId}`, {});
  }
  
  public async getEntityPhotos(entity_type: EntityType, entity_id: number): Promise<Photo[]> {
    return this.api.get<Photo[]>(`/photos/${entity_type}/${entity_id}`);
  }

  public async deleteEntityPhoto(entity_type: EntityType, entity_id: number, photoId: PhotoId) {
    return this.api.delete(`/photos/${entity_type}/${entity_id}/${photoId}`);
  }
}
