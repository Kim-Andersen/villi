import { backendAPI } from '../api/backendAPI';
import LocationService from './LocationService';
import PhotoService from './PhotoService';
import ProductService from './ProductService';
import TaggedService from './TaggedService';
import VendorService from './VendorService';

export const vendorService = new VendorService(backendAPI);
export const locationService = new LocationService(backendAPI);
export const taggedService = new TaggedService(backendAPI);
export const photoService = new PhotoService(backendAPI);
export const productService = new ProductService(backendAPI);