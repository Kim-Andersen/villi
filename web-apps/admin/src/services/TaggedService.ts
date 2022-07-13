import { IBackendAPI } from '../api/types';
import { EntityType, Tag, Tagged } from '../shared';

export default class TaggedService {
  constructor(private readonly api: IBackendAPI) {}

  public async getEntityTags(entity_id: number, type: EntityType): Promise<Tag[]> {
    const params = new URLSearchParams({ entity_id: String(entity_id), type });
    return this.api.get<Tag[]>(`/tagged?${params}`);
  }

  public async upsertEntityTags(tagged: Tagged): Promise<void> {
    return this.api.post(`/tagged`, tagged);
  }
}
