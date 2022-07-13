import { debug } from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { Photo, PhotoId, PhotoInput, PhotoSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IPhotoModel } from './types';

export default class PhotoModel extends ModelBase implements IPhotoModel {
  private readonly log = debug(PhotoModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: PhotoId): Promise<Photo> {
    this.log('findById', { id });

    return this.db
      .selectFrom('photo')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  public async findAll(search: PhotoSearch): Promise<Photo[]> {
    this.log('findAll', { search });

    let query = this.db
      .selectFrom('photo')
      .selectAll();

    query = search.bucket ? query.where('bucket', '=', search.bucket) : query;
    
    return query.execute();
  }
  
  public async insertPhotoWithReservedId(id: PhotoId, input: PhotoInput): Promise<Photo> {
    this.log('insertPhotoWithReservedId', { id, input });

    return this.db
      .insertInto('photo')
      .values({
        id,
        ...input, 
        sizes: sql`${JSON.stringify(input.sizes)}`
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async insertPhoto(input: PhotoInput): Promise<Photo> {
    this.log('insertPhoto', { input });

    return this.db
      .insertInto('photo')
      .values({
        ...input, 
        sizes: sql`${JSON.stringify(input.sizes)}`
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async deleteById(id: PhotoId): Promise<void> {
    this.log('deleteById', { id });

    await this.db
      .deleteFrom('photo')
      .where('id', '=', id)
      .execute();
  }

  public async deleteByKey(key: string): Promise<void> {
    this.log('deleteByKey', { key });

    await this.db
      .deleteFrom('photo')
      .where('key', '=', key)
      .execute();
  }

  public async reservePhotoId(): Promise<PhotoId> {
    const result = await sql
      .raw(`SELECT NEXTVAL('photo_id_seq') as id`)
      .castTo<{ id: PhotoId }>()
      .execute(this.db);

    this.log('reservePhotoId', { result: JSON.stringify(result) });

    if (result.rows.length === 1) {
      const id = result.rows[0].id;
      if (!id) {
        throw new Error(`Failed to reserve photo id. No id returned. Database query result: ${JSON.stringify(result)}`);    
      }
      this.log(`reservePhotoId`, { id });
      return id as PhotoId;
    }
    this.log(`Failed to reserve photo id`, { result });
    throw new Error('Failed to reserve photo id');
  }
}
