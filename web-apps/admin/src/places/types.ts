import { Observable } from 'rxjs';
import { PhotoId, Place, PlaceCreation, PlaceId, TypeOfPlaceId } from '../shared/types';

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
  createNewSpace(creation: PlaceCreation): Promise<Place>;
  /**
   * Update a space.
   */
  updatePlace(placeId: PlaceId, place: Partial<Place>): Promise<Place>;
  /**
   * Get space by id.
   */
  getPlaceById(id: PlaceId): Promise<Place | null>;
  /**
   * Get types of places for a place.
   */
  getPlaceTypes(placeId: PlaceId): Promise<TypeOfPlaceId[]>;
  /**
   * types of places for a place.
   */
  updatePlaceTypes(placeId: PlaceId, types: TypeOfPlaceId[]): Promise<void>;

  deletePhoto(placeId: PlaceId, photoId: PhotoId): Promise<void>;
}