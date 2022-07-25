import { debug } from 'debug';
import type { Database } from '../database';
import { EntityPhoto, EntityPhotoInput, EntityPhotoSearch, Photo, PhotoId } from '../shared';
import { ModelBase } from './ModelBase';
import { IEntityPhotoModel } from './types';

export default class EntityPhotoModel extends ModelBase implements IEntityPhotoModel {
  private readonly log = debug(EntityPhotoModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async countPhotoEntities(photo_id: PhotoId): Promise<number> {
    const { count } = await this.db
      .selectFrom('entity_photo')
      .select(this.db.fn.count<number>('id').as('count'))
      .where('photo_id', '=', photo_id)
      .executeTakeFirstOrThrow();

    this.log('countPhotoEntities', { photo_id, count });
    return Number(count); // TODO: For some reason "count" is returned as a string.
  }

  public async findAll(search: EntityPhotoSearch): Promise<Photo[]> {
    let query = this.db
      .selectFrom('photo')
      .innerJoin('entity_photo', 'entity_photo.photo_id', 'photo.id')
      .selectAll(['photo']);
    
    if (search.photo_id) {
      query = query.where('entity_photo.photo_id', '=', search.photo_id)
    }
    if (search.vendor_id) {
      query = query.where('entity_photo.vendor_id', '=', search.vendor_id)
    }
    if (search.location_id) {
      query = query.where('entity_photo.location_id', '=', search.location_id)
    }
    if (search.vendor_location_id) {
      query = query.where('entity_photo.vendor_location_id', '=', search.vendor_location_id)
    }
    
    return query.execute();
  }

  public async insert(input: EntityPhotoInput): Promise<EntityPhoto> {
    this.log('insert', { input });

    return this.db
      .insertInto('entity_photo')
      .values(input)
      // .onConflict((oc) => oc
      //   .columns(['entity_id', 'entity_type', 'photo_id'])
      //   .doUpdateSet(input)
      // )
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async delete(input: EntityPhotoInput): Promise<void> {
    this.log('delete', { input });

    let query = this.db
      .deleteFrom('entity_photo');

    if (input.vendor_id) {
      query = query.where('vendor_id', '=', input.vendor_id)
    } else if (input.location_id) {
      query = query.where('location_id', '=', input.location_id)
    } else if (input.vendor_location_id) {
      query = query.where('vendor_location_id', '=', input.vendor_location_id)
    }
         
    await query.execute();
  }
}
