import { IBackendAPI } from '../api/types';
import { LocationId, LocationInput } from '../shared';

export default class LocationService {
  constructor(private readonly api: IBackendAPI) {}

  public async addLocation(input: LocationInput): Promise<LocationId> {
    return this.api.post<LocationId>(`/locations`, input);
  }
}
