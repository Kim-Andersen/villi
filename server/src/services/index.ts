import { photosRepo, placePhotosRepo, placesRepo } from '../database/repositories';
import { FileObjectStorage } from './FileObjectStorage';
import GeoService from './GeoService';
import PhotoService from './PhotoService';
import { PlaceSearchService } from './PlaceSearchService';
import PlaceService from './PlaceService';
import { S3ObjectStorage } from './S3ObjectStorage';
import { IObjectStorage } from './types';

// Instantiate services.
export const objectStorage: IObjectStorage = process.env.NODE_ENV === 'production' ? new S3ObjectStorage() : new FileObjectStorage();
export const photoService = new PhotoService(photosRepo, objectStorage);
export const placeService = new PlaceService(placesRepo, placePhotosRepo, photoService);
export const placeSearchService = new PlaceSearchService(placesRepo);
export const geoService = new GeoService();
