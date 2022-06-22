export type PlaceId = number;
export type PhotoId = number;
export type TypeOfPlaceId = number;

export type APIResponse<PayloadType, ValidationErrorType> = PayloadType & {
  error?: {
    message: string;
    validationErrors?: ValidationErrorType[]
  };
};

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
export type PlaceUpdateResult = Pick<Place, 'id' | 'updated_at'>;

export type User = {
  id: number;
  email: string;
};

export type UserListItem = Pick<User, 'id' | 'email'>;

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
  key: string;
  name: string,
  street_name: string,
  street_number: string,
  city: string,
  state?: string,
  postal_code: string,
  country: string,
  coordinates: [number, number];
};

export type PhotoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Photo = {
  id: number;
  created_at: Date;
  key: string;
  type: string;
  bucket: string;
  sizes: Array<PhotoSize>;
};

export type PhotoCreation = {
  file: File;
  contentType: string;
};

export type TypeOfPlace = {
  id: TypeOfPlaceId;
  name: string;
};

export type PlaceTypesUpdate = {
  types: TypeOfPlaceId[];
};

export type PlaceType = {
  type_id: TypeOfPlaceId;
  place_id: PlaceId;
};

export type PlaceSearchResult = {
  places: Place[];
};

export type Location = {
  latitude: number;
  longitude: number;
};