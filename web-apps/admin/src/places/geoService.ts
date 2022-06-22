import { backendAPI } from '../api/backendAPI';
import { GeoAutocompleteResult, GeocodeResult } from '../shared/types';
class GeoService {
  public geocode(query: string): Promise<GeocodeResult[]> {
    return backendAPI.get<GeocodeResult[]>(`/geo/code?query=${query}`);
  }

  public async autocomplete(query: string): Promise<(GeoAutocompleteResult)[]> {
    return backendAPI.get<GeoAutocompleteResult[]>(`/geo/autocomplete?query=${query}`);
  }

  public get isWorking(): boolean {
    return backendAPI.isWorking;
  }
}

const geoService = new GeoService();
export default geoService;