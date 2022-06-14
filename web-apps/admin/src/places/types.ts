import { Observable } from 'rxjs';
import { Place, PlaceId } from '../shared/types';

export interface IPlacesServivce {
  /**
   * Observable of places.
   */
  places: Observable<Place[]>;
  /**
   * Observable of loading state.
   */
  working: Observable<boolean>;
  /**
   * getter of the working state.
   */
  isWorking: boolean;
  /**
   * Fetch all places from the back-end.
   */
  fetchPlaces(): Promise<void>;
  /**
   * Create a new space.
   */
  createNewSpace(place: Partial<Place>): Promise<Place>;
  /**
   * Update a space.
   */
  updatePlace(placeId: PlaceId, place: Partial<Place>): Promise<Place>;
  /**
   * Get space by id.
   */
  getPlaceById(id: PlaceId): Promise<Place | null>;
}