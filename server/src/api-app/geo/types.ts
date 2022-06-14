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