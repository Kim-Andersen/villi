import debug from 'debug';
import { pick } from 'lodash';
import { ILocationModel } from '../../models';
import { Location, LocationId, LocationInput, LocationSearch } from '../../shared';
import { ILocationService } from './types';

export class LocationService implements ILocationService {
  private readonly log = debug(LocationService.name);
  
  constructor(private readonly locationModel: ILocationModel) {
    this.log('initialize');
  }

  public async updateLocation(locationId: LocationId, input: LocationInput): Promise<Pick<Location, 'updated_at'>> {
    return this.locationModel.update(locationId, input);
  }

  public async findLocations(search: LocationSearch): Promise<Location[]> {
    return this.locationModel.findAll(search);
  }

  public getLocationById(id: LocationId): Promise<Location> {
    return this.locationModel.findById(id);
  }

  public deleteLocation(id: LocationId): Promise<void> {
    return this.locationModel.deleteLocation(id);
  }

  public async createLocation(input: LocationInput): Promise<LocationId> {
    this.log('createLocation', { input });

    // Check if an identical location already exists.
    const locationSearch: LocationSearch = pick(input, 'name', 'street_name', 'street_number', 'postal_code', 'city', 'country');
    const existingLocation = await this.locationModel.findOne(locationSearch);

    if (existingLocation) {
      this.log('Location already exists.');
      return existingLocation.id as LocationId;
    } else {
      return this.locationModel.insertLocation(input);
    }
  }
}