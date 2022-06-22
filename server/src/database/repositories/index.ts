import db from '../index';
import PhotosRepo from './PhotosRepo';
import PlacePhotosRepo from './PlacePhotosRepo';
import PlacesRepo from './PlacesRepo';
import PlaceTypesRepo from './PlaceTypesRepo';
import UserRepo from './UserRepo';

// Instantiate repositories.
export const photosRepo = new PhotosRepo(db);
export const placesRepo = new PlacesRepo(db);
export const placePhotosRepo = new PlacePhotosRepo(db);
export const placeTypesRepo = new PlaceTypesRepo(db);
export const userRepo = new UserRepo(db);