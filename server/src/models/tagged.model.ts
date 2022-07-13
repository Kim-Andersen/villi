import { debug } from 'debug';
import type { Database } from '../database';
import { Tagged, TaggedSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { ITaggedModel } from './types';

export default class TaggedModel extends ModelBase implements ITaggedModel {
  private readonly log = debug(TaggedModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findAllEntityTags(search: TaggedSearch): Promise<string[]> {
    const result = await this.db
      .selectFrom('tagged')
      .select('tags')
      .where('entity_id', '=', search.entity_id)
      .where('type', '=', search.type)
      .executeTakeFirst()
    return result?.tags ?? [];
  }
  
  public async upsertEntityTags(input: Tagged): Promise<void> {
    this.log('upsertEntityTags', { input });

    await this.db
      .insertInto('tagged')
      .values(input)
      .onConflict((oc) => oc
        .columns(['entity_id', 'type'])
        .doUpdateSet({ tags: input.tags })
      )
      .execute();
  }
}
