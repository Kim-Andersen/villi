import { pick } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { backendAPI } from '../api/backendAPI';
import { Place, PlaceId, PlaceUpdateRequest } from '../shared/types';
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

  public async updatePlace(placeId: PlaceId, update: PlaceUpdateRequest): Promise<Place> {
    const place: PlaceUpdateRequest = pick(update, 'name', 'description', 'street_name', 'street_number', 'postal_code', 'city', 'coordinates');
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
}

const placesService = new PlacesService();
export default placesService;