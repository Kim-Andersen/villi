import { entityPhotoModel, locationModel, photoModel, taggedModel, vendorLocationModel, vendorModel } from '../models';
import { LocationService } from './LocationService/LocationService';
import { FileObjectStorage } from './ObjectStorage/FileObjectStorage';
import { S3ObjectStorage } from './ObjectStorage/S3ObjectStorage';
import { IObjectStorage } from './ObjectStorage/types';
import PhotoService from './PhotoService/PhotoService';
import { TaggedService } from './TaggedService/TaggedService';
import { VendorService } from './VendorService/VendorService';

// Instantiate services.
export const objectStorage: IObjectStorage = process.env.NODE_ENV === 'production' ? new S3ObjectStorage() : new FileObjectStorage();
export const photoService = new PhotoService(photoModel, entityPhotoModel, objectStorage);
export const locationService = new LocationService(locationModel);
export const vendorService = new VendorService(vendorModel, vendorLocationModel, photoService);
export const taggedService = new TaggedService(taggedModel);
