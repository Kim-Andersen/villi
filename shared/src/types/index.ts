
import type { Location, VendorLocation } from '../generated/db';
export * from '../generated/db';
export * from '../schemas';
export type VendorId = number & { __flavor: 'VendorId' };
export type LocationId = number & { __flavor: 'LocationId' };
export type VendorLocationId = number & { __flavor: 'VendorLocationId' };
export type PhotoId = number & { __flavor: 'PhotoId' };
export type ProductId = number & { __flavor: 'ProductId' };

/**
 * Two-item array containing latitude and longitude.
 */
export type LatLng = number[];
export type PlaceId = number;
export type TypeOfPlaceId = number;
export type VendorLocationDetails = VendorLocation & { location: Location };

export type APIResponse<PayloadType, ValidationErrorType> = PayloadType & {
  error?: {
    message: string;
    validationErrors?: ValidationErrorType[]
  };
};


