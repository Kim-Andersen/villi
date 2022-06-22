import debug from 'debug';
import { ItemCreateError, ItemDeleteError, ItemNotFoundError } from '../../errors';
import { Photo, PhotoId } from '../../shared/types';
import { sql } from '../sql';
import { IDatabase } from '../types';

type CreatePhotoColumns = Pick<Photo, 'bucket' | 'key' | 'sizes' | 'type'> & Partial<Pick<Photo, 'id'>>;

export interface IPhotosRepo {
  /**
   * Find a photo by id.
   * @throws {ItemNotFoundError}
   */
  findById(photoId: PhotoId): Promise<Photo>
  /**
   * Create a photo.
   * @throws {ItemCreationError}
   */
  create(columns: CreatePhotoColumns): Promise<Photo>;
  /**
   * Delete a photo by id.
   * @throws {ItemDeleteError}
   */
  deleteById(photoId: PhotoId): Promise<void>;
  /**
   * Delete a photo by key.
   * @throws {ItemDeleteError}
   */
  deleteByKey(key: string): Promise<void>;
  /**
   * Reserves an id from the photos table.
   * @throws {Error}
   */
  reservePhotoId(): Promise<PhotoId>;
}

export default class PhotosRepo implements IPhotosRepo {
  private readonly log: debug.Debugger;

  constructor(private readonly db: IDatabase) {
    this.log = debug(PhotosRepo.name)
  }

  public async findById(photoId: PhotoId): Promise<Photo> {
    const result = await this.db.query(sql`SELECT p.*, to_json(p.sizes) AS sizes FROM photos p WHERE id = $1`, [photoId]);
    if (result.rowCount === 1) {
      return result.rows[0] as Photo;
    }

    this.log(`Photo id ${photoId} not found`);
    throw new ItemNotFoundError();
  }
  
  public async create(columns: CreatePhotoColumns): Promise<Photo> {
    this.log(`Inserting photo `, columns);
    const { id, key, bucket, sizes, type: contentType } = columns;

    const params: any[] = [key, contentType, bucket, `{${sizes?.join(',')}}`];
    let query: string;
    if (id) {
      query = sql`INSERT INTO photos(id, key, type, bucket, sizes) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
      params.unshift(id);
    } else {
      query = sql`INSERT INTO photos(key, type, bucket, sizes) VALUES ($1,$2,$3,$4) RETURNING *`;
    }
;
    const result = await this.db.query(query, params);
    
    if (result.rowCount === 1) {
      return result.rows[0] as Photo;
    }

    this.log('Failed to add photo to database', { id, key, bucket, sizes, type: contentType });
    throw new ItemCreateError();
  }

  public async deleteById(photoId: PhotoId): Promise<void> {
    const result = await this.db.query(sql`DELETE FROM photos WHERE id = $1`, [photoId]);
    if (result.rowCount !== 1) {
      throw new ItemDeleteError();
    }
  }

  public async deleteByKey(key: string): Promise<void> {
    const result = await this.db.query(sql`DELETE FROM photos WHERE key = $1`, [key]);
    if (result.rowCount !== 1) {
      throw new ItemDeleteError();
    }
  }

  public async reservePhotoId(): Promise<PhotoId> {
    const result = await this.db.query<Pick<Photo, 'id'>>(sql`SELECT NEXTVAL('photos_id_seq') AS id`);
    if (result.rows.length === 1) {
      const id = result.rows[0].id;
      this.log(`reservePhotoId`, { id });
      return id;
    }
    this.log(`Failed to reserve photo id`, { result });
    throw new Error('Failed to reserve photo id');
  }
}
