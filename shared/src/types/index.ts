
import type { EntityPhoto, Location, Photo, VendorLocation } from '../generated/db';
export * from '../generated/db';
export * from '../schemas';
export type VendorId = number & { __flavor: 'VendorId' };
export type LocationId = number & { __flavor: 'LocationId' };
export type VendorLocationId = number & { __flavor: 'VendorLocationId' };
export type PhotoId = number & { __flavor: 'PhotoId' };
export type ProductId = number & { __flavor: 'ProductId' };
export type ProductCollectionId = number & { __flavor: 'ProductCollectionId' };
export type AccountId = number & { __flavor: 'AccountId' };
export type EntityId = VendorId | LocationId | VendorLocationId | ProductId;
/**
 * Two-item array containing latitude and longitude.
 */
export type LatLng = number[];
export type PlaceId = number;
export type TypeOfPlaceId = number;
export type VendorLocationDetails = VendorLocation & { location: Location };

export type EntityPhotoDetails = Photo & Pick<EntityPhoto, 'type'>;

export type APIResponse<PayloadType, ValidationErrorType> = PayloadType & {
  error?: {
    message: string;
    validationErrors?: ValidationErrorType[]
  };
};


