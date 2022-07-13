import debug from 'debug';
import config from '../config';

export type GooglePlaceAutocompleteResult = {
  place_id: string;
  /**
   * @example "Le Pointu, Rue Neuve, Lausanne, Schweiz"
   */
  description: string; 
  /**
   * @example ["bar", "point_of_interest", "establishment"]
   */
  types: string[];
};

/**
 * https://developers.google.com/maps/documentation/geocoding/requests-geocoding#Types
 */
type AddressComponentType = 'street_address' | 'street_number' | 'route' | 'locality' | 'political' | 'administrative_area_level_1' | 'administrative_area_level_2' | 'country' | 'postal_code' | '';

export type GooglePlaceDetailsResult = {
  place_id: string;
  /**
   * @example "Le Pointu Café-Bar & Brunchs"
   */
  name: string;
  /**
   * @example "Rue Neuve 2, 1003 Lausanne, Switzerland"
   */
  address_components: Array<{ long_name: string; short_name: string; types: AddressComponentType[] }>;
  formatted_address: string;
  geometry: {
    location : {
      lat : number;
      lng : number;
   }
  };
  photos: [
    {
      width: number;
      height : number;
      photo_reference: string;
      html_attributions : string[];
   }
  ];
  opening_hours : {
    open_now : boolean;
    periods : [
       {
          close : {
             day : number;
             time : string;
          },
          open : {
            day : number;
            time : string;
          }
       }
    ];
  };
  price_level : number;
  rating: number;
  reviews: [
    {
      author_name : string;
      author_url : string;
      language : string;
      profile_photo_url : string;
      rating : number;
      relative_time_description : string;
      text : string;
      time : number;
    }
  ];
  /**
   * @example ["bar", "point_of_interest", "establishment"]
   */
  types : string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  website: string;
  /**
   * @example "OPERATIONAL"
   */
  business_status: string;
}

export class GooglePlacesService {
  private readonly log: debug.Debugger;

  constructor() {
    this.log = debug(GooglePlacesService.name);
  }

  /**
   * Returns place predictions in response to a query.
   * 
   * @param query {string}
   * 
   * https://developers.google.com/maps/documentation/places/web-service/autocomplete
   */
  public async autocomplete(query: string): Promise<GooglePlaceAutocompleteResult[]> {
    this.log('autocomplete', { query });

    const urlParams = new URLSearchParams({
      key: config.google.maps.apiKey,
      input: query
    });

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${urlParams}`;
    const response = await fetch(url);

    if (response.ok) {
      const { predictions } = await response.json() as { predictions: GooglePlaceAutocompleteResult[] };
      return predictions.map(p => ({
        place_id: p.place_id,
        description: p.description,
        types: p.types
      }));
    } else {
      this.log(`Google places autocomplete request for "${query}" failed`, response);
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
    this.log('getPlaceDetails', { place_id });

    const urlParams = new URLSearchParams({
      key: config.google.maps.apiKey,
      place_id
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${urlParams}`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json() as GooglePlaceDetailsResult;
    } else {
      this.log(`Google place details request for place_id "${place_id}" failed`, response);
      throw response;
    }
  }
}