
import type { Location, VendorLocation } from '../generated/db';
export * from '../generated/db';
export * from '../schemas';
export type VendorId = number & { __flavor: 'VendorId' };
export type LocationId = number & { __flavor: 'LocationId' };
export type VendorLocationId = number & { __flavor: 'VendorLocationId' };
export type PhotoId = number & { __flavor: 'PhotoId' };

/**
 * Two-item array containing latitude and longitude.
 */
export type LatLng = number[];

export type PlaceId = number;
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

// export type LocationQuery = Partial<Omit<Location, 'id' | 'opening_hours'>>;

// export type VendorListItem = Pick<Vendor, 'id' | 'name'>;

export type VendorLocationDetails = VendorLocation & { location: Location };

// export type VendorLocationUpdate = Pick<VendorLocationDetails['vendorLocation'], 'types' | 'note' | 'opening_hours'>;

// export type VendorUpdate = Pick<Vendor, 'name' | 'description' | 'website_url' | 'instagram_url' | 'facebook_url'>;

