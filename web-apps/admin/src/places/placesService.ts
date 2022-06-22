import { pick } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { backendAPI } from '../api/backendAPI';
import { Photo, PhotoCreation, PhotoId, Place, PlaceCreation, PlaceId, PlaceUpdate, TypeOfPlace, TypeOfPlaceId } from '../shared/types';
import snackbarService from '../snackbar/snackbarService';
import { IPlacesServivce } from './types';

class PlacesService implements IPlacesServivce {
  private initializationComplete: Promise<unknown>;
  private placesState = new BehaviorSubject<Place[]>([]);
  private typesOfPlacesState = new BehaviorSubject<TypeOfPlace[]>([]);

  public places = this.placesState.asObservable();
  public typesOfPlaces = this.typesOfPlacesState.asObservable();
  public working = backendAPI.working;

  constructor() {
    this.initializationComplete = Promise.all([
      this.fetchPlaces(),
      this.fetchTypesOfPlaces()
    ]);
  }

  public get isWorking(): boolean {
    return backendAPI.isWorking;
  }

  public async fetchPlaces(): Promise<void> {
    const places = await backendAPI.get<Place[]>('/places');
    this.placesState.next(places);
  }

  public async fetchTypesOfPlaces(): Promise<void> {
    const types = await backendAPI.get<TypeOfPlace[]>('/places/types');
    this.typesOfPlacesState.next(types);
  }

  public async createNewSpace(creation: PlaceCreation): Promise<Place> {
    const place = await backendAPI.post<Place>('/places', { place: creation });
    this.placesState.next([...this.placesState.value, place]);
    return place;
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
    snackbarService.showSnackbar('Place deleted.', 'success');
  }

  public async getPlaceById(placeId: PlaceId): Promise<Place | null> {
    await this.initializationComplete;
    return this.placesState.value.find(p => p.id === placeId) || null;
  }

  public async getPlaceTypes(placeId: PlaceId): Promise<TypeOfPlaceId[]> {
    return backendAPI.get<TypeOfPlaceId[]>(`/places/${placeId}/types`);
  }

  public async updatePlaceTypes(placeId: PlaceId, types: TypeOfPlaceId[]): Promise<void> {
    await backendAPI.put(`/places/${placeId}/types`, { types });
  }

  public async addPhoto(placeId: PlaceId, data: PhotoCreation): Promise<Photo> {
    const formData = new FormData();
    formData.append('file', data.file);
    return backendAPI.post<Photo>(`/places/${placeId}/photos`, null, formData);
  }

  public async getPhotos(placeId: PlaceId): Promise<Photo[]> {
    return backendAPI.get<Photo[]>(`/places/${placeId}/photos`);
  }

  public async deletePhoto(placeId: PlaceId, photoId: PhotoId): Promise<void> {
    return await backendAPI.delete(`/places/${placeId}/photos/${photoId}`);
  }
}

const placesService = new PlacesService();
export default placesService;