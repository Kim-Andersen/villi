export type PlaceId = number;

export type Place = {
  id: PlaceId;
  created_at: Date;
  updated_at?: Date;
  name: string;
  description: string;
  street_name: string;
  street_number: string;
  postal_code: string;
  city: string;
  /**
   * Latitute and longitude.
   */
  coordinates: Array<number>;
}
export type PlaceUpdate = Omit<Place, 'created_at' | 'updated_at'>;
export type PlaceCreation = Omit<Place, 'id' | 'created_at' | 'updated_at'>;

export type User = {
  id: number;
  email: string;
}

export type GeocodeResult = {
  formattedAddress?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  extra?: {
      googlePlaceId?: string | undefined;
      confidence?: number | undefined;
  } | undefined;
  administrativeLevels?: {
      level1long?: string | undefined;
      level1short?: string | undefined;
      level2long?: string | undefined;
      level2short?: string | undefined;
  } | undefined;
  city?: string | undefined;
  streetName?: string | undefined;
  streetNumber?: string | undefined;
  country?: string | undefined;
  countryCode?: string | undefined;
  zipcode?: string | undefined;
  provider?: string | undefined;
  state?: string | undefined;
  stateCode?: string | undefined;
  county?: string | undefined;
  district?: string | undefined;
  building?: string | undefined;
};

export type GeoAutocompleteResult = {
  key: number;
  name: string,
  street_name: string,
  street_number: string,
  city: string,
  state?: string,
  postal_code: string,
  country: string,
  coordinates: [number, number];
};