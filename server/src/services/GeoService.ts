import debug from 'debug';
import httpStatus from 'http-status';
import fetch from 'node-fetch';
import NodeGeoCoder from 'node-geocoder';
import config from '../config';
import { GeoAutocompleteResult } from '../shared/types';
// import { LocationIQAutocompleteResult } from '../types';

const geocoderOptions: Readonly<NodeGeoCoder.Options> = {
  apiKey: config.geocoder.apiKey,
  provider: config.geocoder.provider as NodeGeoCoder.Providers,
  httpAdapter: 'https',
  formatter: null
};

export default class GeoService {
  private readonly log: debug.Debugger;
  private readonly geocoder: NodeGeoCoder.Geocoder
  
  constructor() {
    this.log = debug(GeoService.name);
    this.geocoder = NodeGeoCoder(geocoderOptions);
  }

  public async geocode(query: string): Promise<NodeGeoCoder.Entry[]> {
    this.log(`geocode "${query}"`);
    return await this.geocoder.geocode(query);
  }

  public async autocomplete(query: string): Promise<GeoAutocompleteResult[]> {
    this.log(`autocomplete query "${query}"`);

    const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?${new URLSearchParams({
      key: config.geocoder.apiKey,
      q: query,
    })}`);

    if (response.ok) {
      const results = await response.json() as LocationIQAutocompleteResult[];
      return results.map(({ address, lat, lon }) => ({
        key: `${lat}_${lon}`,
        name: address.name,
        street_name: address.road,
        street_number: address.house_number,
        city: address.city,
        state: address.state,
        postal_code: address.postcode,
        country: address.country,
        coordinates: [Number(lat), Number(lon)]
      }));
    } else if (response.status === httpStatus.NOT_FOUND) {
      this.log(`no results found for query "${query}"`);
      return [];
    } else {
      this.log(`autocomplete request for "${query}" failed`, response);
      throw response;
    }
  }
}

// https://locationiq.com/docs#autocomplete
export type LocationIQAutocompleteResult = {
  place_id: string,
  osm_id: number,
  osm_type: 'node' | 'way' | 'relation',
  licence: string,
  lat: string,
  lon: string,
  boundingbox: number[],
  class: string,
  type: string,
  display_name: string,
  display_place: string,
  display_address: string,
  address: {
    name: string,
    house_number: string,
    road: string,
    city: string,
    state: string,
    postcode: string,
    country: string
  }
};