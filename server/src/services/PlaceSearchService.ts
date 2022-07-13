import assert from 'assert';
import debug from 'debug';
import { IPlacesRepo } from '../repositories/PlacesRepo';
import { PlaceSearchResult } from '../shared/types';
import { LatLng } from '../shared/types/LatLng';

interface IPlaceSearchService {
  /**
   * 
   * @param location {LatLng} The point around which to retrieve place information, specified as latitude and longitude.
   * @param radius Distance (in meters) within which to return place results.
   */
  nearby(location: LatLng, radius: number): Promise<PlaceSearchResult>
}

export class PlaceSearchService implements IPlaceSearchService {
  private readonly log: debug.Debugger;

  constructor(private readonly placesRepo: IPlacesRepo) {
    this.log = debug(PlaceSearchService.name);
  }
  public async nearby(location: LatLng, radius: number): Promise<PlaceSearchResult> {
    this.log('nearby', { location, radius });
    assert(radius <= 50000); // Max 50.000 meters.

    const places = await this.placesRepo.searchNearby(location, radius);
    this.log(`nearby search returned ${places.length} places`, { location, radius });
    return { places };
  }
}