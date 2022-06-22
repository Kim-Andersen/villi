import debug from 'debug';
import { ItemCreateError, ItemDeleteError } from '../../errors';
import { Photo, PhotoId, PlaceId } from '../../shared/types';
import { sql } from '../sql';
import { IDatabase } from '../types';

export interface IPlacePhotosRepo {
  /**
   * Add a photo to a place.
   */
  create(placeId: PlaceId, photoId: PhotoId): Promise<void>;
  /**
   * Find photos for a place.
   */
  findForPlace(placeId: PlaceId): Promise<Photo[]>;
  /**
   * Delete a photo for a place.
   * 
   * @throws {ItemDeleteError} if not found.
   */
  delete(placeId: PlaceId, photoId: PhotoId): Promise<void>;
}

export default class PlacePhotosRepo implements IPlacePhotosRepo {
  private readonly log: debug.Debugger;

  constructor(private readonly db: IDatabase) {
    this.log = debug(PlacePhotosRepo.name)
  }
  
  public async create(placeId: PlaceId, photoId: PhotoId): Promise<void> {
    this.log(`Add photo to place id ${placeId}`, { photoId });

    const result = await this.db.query(sql`INSERT INTO place_photos(place_id, photo_id) VALUES($1,$2)`, [placeId, photoId])

    if (result.rowCount !== 1) {
      const message = `Failed to add photo to place`;
      this.log(message, { placeId, photoId });
      throw new ItemCreateError(message);
    }
  }

  public async findForPlace(placeId: PlaceId): Promise<Photo[]> {
    this.log('findForPlace', { placeId });
    const query = sql`
      SELECT p.id, p.created_at, p.key, p.bucket, p.type, to_json(p.sizes) AS sizes
      FROM photos p INNER JOIN place_photos pp on pp.photo_id = p.id 
      WHERE pp.place_id = $1
    `;
    const { rows } = await this.db.query<Photo>(query, [placeId]);
    return rows;
  }

  public async delete(placeId: PlaceId, photoId: PhotoId): Promise<void> {
    this.log(`Delete photo for place id ${placeId}`, { photoId });
    
    const result = await this.db.query(
      sql`DELETE FROM place_photos WHERE place_id = $1 AND photo_id = $2`, 
      [placeId, photoId]
    );
    
    if (result.rowCount !== 1) {
      const message = `Failed to delete place photo`;
      this.log(message, { placeId, photoId });
      throw new ItemDeleteError(message);
    }
  }
}
