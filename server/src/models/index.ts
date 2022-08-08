import { database } from '../database';
import EntityPhotoModel from './entityPhoto.model';
import LocationModel from './location.model';
import PhotoModel from './photo.model';
import ProductModel from './product.model';
import TaggedModel from './tagged.model';
import VendorModel from './vendor.model';
import VendorLocationModel from './vendorLocation.model';

export * from './types';
export const vendorModel = new VendorModel(database);
export const locationModel = new LocationModel(database);
export const vendorLocationModel = new VendorLocationModel(database);
export const taggedModel = new TaggedModel(database);
export const photoModel = new PhotoModel(database);
export const entityPhotoModel = new EntityPhotoModel(database);
export const productModel = new ProductModel(database);