import { debug } from 'debug';
import type { Database } from '../database';
import { EntityPhoto, EntityPhotoInput, EntityType, Photo } from '../shared';
import { ModelBase } from './ModelBase';
import { IEntityPhotoModel } from './types';

export default class EntityPhotoModel extends ModelBase implements IEntityPhotoModel {
  private readonly log = debug(EntityPhotoModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  findAllEntityPhotos(entity_id: number, entity_type: EntityType): Promise<Photo[]> {
    return this.db
      .selectFrom('photo')
      .innerJoin('entity_photo', 'entity_photo.photo_id', 'photo.id')
      .selectAll('photo')
      .where('entity_photo.entity_id', '=', entity_id)
      .where('entity_photo.entity_type', '=', entity_type)
      .execute();
  }

  public async insert(input: EntityPhotoInput): Promise<EntityPhoto> {
    this.log('insert', { input });

    return this.db
      .insertInto('entity_photo')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async delete(input: EntityPhotoInput): Promise<void> {
    this.log('delete', { input });

    await this.db
      .deleteFrom('entity_photo')
      .where('entity_id', '=', input.entity_id)
      .where('entity_type', '=', input.entity_type)
      .where('photo_id', '=', input.photo_id)
      .execute();
  }
}
