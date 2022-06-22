import debug from 'debug';
import { IPlacePhotosRepo } from '../database/repositories/PlacePhotosRepo';
import { IPlacesRepo } from '../database/repositories/PlacesRepo';
import { Photo, PhotoId, Place, PlaceCreation, PlaceId, PlaceUpdate, PlaceUpdateResult } from '../shared/types';
import { IPhotoService } from './PhotoService';
import { IPlaceService } from './types';

export default class PlaceService implements IPlaceService {
  private readonly log: debug.Debugger;

  constructor(
    private readonly placeRepo: IPlacesRepo, 
    private readonly placePhotosRepo: IPlacePhotosRepo,
    private readonly photoService: IPhotoService) {
    this.log = debug(PlaceService.name)
  }

  public async create(creation: PlaceCreation): Promise<Place> {
    this.log(`Create place`, creation);
    return this.placeRepo.create(creation);
  }

  public async update(placeUpdate: PlaceUpdate): Promise<PlaceUpdateResult> {
    this.log(`Update place`, placeUpdate);
    return this.placeRepo.update(placeUpdate);
  }

  public async delete(placeId: PlaceId): Promise<void> {
    this.log(`Delete place id ${placeId}`);
    return this.placeRepo.delete(placeId);
  }

  public async addPhoto(placeId: PlaceId, filePath: string, type: string): Promise<Photo> {
    this.log(`Add photo to place id ${placeId}`, { filePath, type });

    const photo = await this.photoService.addPhoto({ bucket: 'villi-photos', filePath, type, sizes: ['sm', 'md'] });
    await this.placePhotosRepo.create(placeId, photo.id);
    return photo;
  }

  public async deletePhoto(placeId: PlaceId, photoId: PhotoId): Promise<void> {
    this.log('deletePhoto', { placeId, photoId });
    return this.photoService.deletePhoto(photoId);
  }
}