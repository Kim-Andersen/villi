import { Location, LocationId, LocationInput, LocationSearch } from '../../shared';

export interface ILocationService {
  /**
   * Inserts a new location unless an identical one already exists.
   * 
   * @returns Inserted location or, if an identical one exists, the existing idential location.
   */
  createLocation(input: LocationInput): Promise<LocationId>;
  getLocationById(id: LocationId): Promise<Location>;
  deleteLocation(id: LocationId): Promise<void>;
  findLocations(search: LocationSearch): Promise<Location[]>
}