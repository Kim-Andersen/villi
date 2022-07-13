import { Photo, PhotoId, Place, PlaceCreation, PlaceId, PlaceUpdate, PlaceUpdateResult } from '../shared/types';

export interface IPlaceService {
  /**
   * Create a new place.
   */
  create(creation: PlaceCreation): Promise<Place>;
  /**
   * Update an existing place.
   */
  update(placeUpdate: PlaceUpdate): Promise<PlaceUpdateResult>;
  /**
   * Delete a place.
   */
  delete(placeId: PlaceId): Promise<void>;
  /**
   * Add a photo to a place.
   * 
   * @param placeId
   * @param filePath Path to uploaded file. 
   * @param contentType Content type of upload photo.
   */
  addPhoto(placeId: PlaceId, filePath: string, contentType: string): Promise<Photo>;
  /**
   * Delete a place photo.
   */
  deletePhoto(placeId: PlaceId, photoId: PhotoId): Promise<void>;
}

export interface IObjectStorage {
  uploadObject(bucket: string, key: string, contentType: string, body: Buffer): Promise<void>;
  deleteObject(bucket: string, key: string): Promise<void>;
  ensureBucket(bucket: string): Promise<void>;
}