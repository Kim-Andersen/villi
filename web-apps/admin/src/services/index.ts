import { backendAPI } from '../api/backendAPI';
import config from '../config';
import GooglePlacesService from './GooglePlacesService/GooglePlacesService';
import LocationService from './LocationService';
import TaggedService from './TaggedService';
import VendorService from './VendorService';

export const googlePlacesService = new GooglePlacesService({ apiKey: config.google.maps.apiKey });

export const vendorService = new VendorService(backendAPI);
export const locationService = new LocationService(backendAPI);
export const taggedService = new TaggedService(backendAPI);