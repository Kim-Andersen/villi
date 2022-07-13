import debug from 'debug';
import { ITaggedModel } from '../../models';
import { Tagged, TaggedSearch } from '../../shared';

export class TaggedService {
  private readonly log = debug(TaggedService.name);
  
  constructor(private readonly taggedModel: ITaggedModel) {
    this.log('initialize');
  }

  public async findAllEntityTags(search: TaggedSearch): Promise<string[]> {
    return this.taggedModel.findAllEntityTags(search);
  }

  public async setEntityTags(input: Tagged): Promise<void> {
    return this.taggedModel.upsertEntityTags(input);
  }
}