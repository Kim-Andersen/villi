import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { GooglePlaceAutocompleteResult, GooglePlaceDetailsResult } from './types';

export default class GooglePlacesService {
  private workingState = new BehaviorSubject<boolean>(false);
  public working = this.workingState.asObservable().pipe(distinctUntilChanged());

  constructor(private readonly options: { apiKey: string }) {}

  /**
   * Returns place predictions in response to a query.
   * 
   * @param query {string}
   * 
   * https://developers.google.com/maps/documentation/places/web-service/autocomplete
   */
  public async autocomplete(query: string): Promise<GooglePlaceAutocompleteResult[]> {
    this.workingState.next(true);

    const urlParams = new URLSearchParams({
      key: this.options.apiKey,
      input: query
    });

    let response: Response;
    try {
      response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${urlParams}`, { mode: 'no-cors', headers: {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
      } });
    } finally {
      this.workingState.next(false);
    }
    debugger

    if (response.status === 200) {
      const { predictions } = await response.json() as { predictions: GooglePlaceAutocompleteResult[] };
      return predictions.map(p => ({
        place_id: p.place_id,
        description: p.description,
        types: p.types
      }));
    } else {
      console.error(`Google places autocomplete request for "${query}" failed`, response);
      throw response;
    }
  }

  /**
   * Get Google Place details.
   * 
   * @param place_id {string} Google Place id.
   * 
   * https://developers.google.com/maps/documentation/places/web-service/details
   */
  public async getPlaceDetails(place_id: string): Promise<GooglePlaceDetailsResult> {
    this.workingState.next(true);

    const urlParams = new URLSearchParams({
      key: this.options.apiKey,
      place_id
    });

    let response: Response;
    try {
      response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${urlParams}`);
    } finally {
      this.workingState.next(false);
    }
    if (response.ok) {
      return await response.json() as GooglePlaceDetailsResult;
    } else {
      console.error(`Google place details request for place_id "${place_id}" failed`, response);
      throw response;
    }
  }
}