import { debug } from 'debug';
import type { Database } from '../database';
import { EntityPhotoDetails, EntityPhotoInput, EntityPhotoSearch, PhotoId } from '../shared';
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

  public async findAll(search: EntityPhotoSearch): Promise<EntityPhotoDetails[]> {
    let query = this.db
      .selectFrom('photo')
      .innerJoin('entity_photo', 'entity_photo.photo_id', 'photo.id')
      .select('entity_photo.type')
      .selectAll('photo');
    
    if (search.photo_id) {
      query = query.where('entity_photo.photo_id', '=', search.photo_id)
    }

    if (search.entityType === 'vendor') {
      query = query.where('entity_photo.vendor_id', '=', search.entityId)
    } else if (search.entityType === 'location') {
      query = query.where('entity_photo.location_id', '=', search.entityId)
    } else if (search.entityType === 'vendor_location') {
      query = query.where('entity_photo.vendor_location_id', '=', search.entityId)
    } else if (search.entityType === 'product') {
      query = query.where('entity_photo.product_id', '=', search.entityId)
    }

    return query.execute();
  }

  public findOneById(id: number): Promise<EntityPhotoDetails> {
    return this.db
      .selectFrom('photo')
      .innerJoin('entity_photo', 'entity_photo.photo_id', 'photo.id')
      .select('entity_photo.type')
      .selectAll('photo')
      .where('entity_photo.id', '=', id)
      .executeTakeFirstOrThrow();
  }

  public async insert(input: EntityPhotoInput): Promise<EntityPhotoDetails> {
    this.log('insert', { input });

    const { id } = await this.db
      .insertInto('entity_photo')
      .values(input)
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.findOneById(id);
  }

  public async delete(input: EntityPhotoInput): Promise<void> {
    this.log('delete', { input });

    let query = this.db
      .deleteFrom('entity_photo')
      .where('photo_id', '=', input.photo_id)

    if (input.vendor_id) {
      query = query.where('vendor_id', '=', input.vendor_id)
    } else if (input.location_id) {
      query = query.where('location_id', '=', input.location_id)
    } else if (input.product_id) {
      query = query.where('product_id', '=', input.product_id)
    }else if (input.vendor_location_id) {
      query = query.where('vendor_location_id', '=', input.vendor_location_id)
    }
         
    await query.execute();
  }
}
