import { entityPhotoModel, locationModel, photoModel, taggedModel, vendorLocationModel, vendorModel } from '../models';
import { FileObjectStorage } from './FileObjectStorage';
import { LocationService } from './LocationService/LocationService';
import PhotoService from './PhotoService/PhotoService';
import { S3ObjectStorage } from './S3ObjectStorage';
import { TaggedService } from './TaggedService/TaggedService';
import { IObjectStorage } from './types';
import { VendorService } from './VendorService/VendorService';

// Instantiate services.
// export const photoService = new PhotoService(photosRepo, objectStorage);
// export const placeSearchService = new PlaceSearchService(placesRepo);
export const objectStorage: IObjectStorage = process.env.NODE_ENV === 'production' ? new S3ObjectStorage() : new FileObjectStorage();
export const vendorService = new VendorService(vendorModel, vendorLocationModel);
export const locationService = new LocationService(locationModel);
export const taggedService = new TaggedService(taggedModel);
export const photoService = new PhotoService(photoModel, entityPhotoModel, objectStorage);
