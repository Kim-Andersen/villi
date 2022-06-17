import { pick } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { backendAPI } from '../api/backendAPI';
import { Photo, PhotoCreation, PhotoId, Place, PlaceId, PlaceUpdate } from '../shared/types';
import { IPlacesServivce } from './types';

class PlacesService implements IPlacesServivce {
  private fetchComplete: Promise<void>;
  private placesState = new BehaviorSubject<Place[]>([]);

  public places = this.placesState.asObservable();
  public working = backendAPI.working;

  constructor() {
    this.fetchComplete = this.fetchPlaces();
  }

  public get isWorking(): boolean {
    return backendAPI.isWorking;
  }

  public async fetchPlaces(): Promise<void> {
    const { places } = await backendAPI.get<{ places: Place[] }>('/places');
    this.placesState.next(places);
  }

  public async createNewSpace(place: Partial<Place> = {}): Promise<Place> {
    const newPlace = await backendAPI.post<Place>('/places', { place });
    this.placesState.next([...this.placesState.value, newPlace]);
    return newPlace;
  }

  public async updatePlace(placeId: PlaceId, update: PlaceUpdate): Promise<Place> {
    const place: PlaceUpdate = pick(update, 'id', 'name', 'description', 'street_name', 'street_number', 'postal_code', 'city', 'coordinates');
    const updatedPlace = await backendAPI.put<Place>(`/places/${placeId}`, { place });
    await this.fetchPlaces();
    return updatedPlace;
  }

  public async deletePlace(placeId: PlaceId): Promise<void> {
    await backendAPI.delete(`/places/${placeId}`);
    await this.fetchPlaces();
  }

  public async getPlaceById(id: PlaceId): Promise<Place | null> {
    await this.fetchComplete;
    return this.placesState.value.find(p => p.id === id) || null;
  }

  public async addPhoto(placeId: PlaceId, data: PhotoCreation): Promise<Photo> {
    const formData = new FormData();
    formData.append('file', data.file);
    return backendAPI.post<Photo>(`/places/${placeId}/photos`, null, formData);
  }

  public async getPhotos(placeId: PlaceId): Promise<Photo[]> {
    return backendAPI.get<Photo[]>(`/places/${placeId}/photos`);
  }

  public async deletePhoto(placeId: PlaceId, photoId: PhotoId): Promise<boolean> {
    const response = await backendAPI.delete(`/places/${placeId}/photos/${photoId}`);
    return response.ok;
  }
}

const placesService = new PlacesService();
export default placesService;