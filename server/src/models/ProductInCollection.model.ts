import debug from 'debug';
import type { Database } from '../database';
import { ProductInCollection, ProductInCollectionsInput, ProductInCollectionsSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IProductInCollectionModel } from './types';

export default class ProductInCollectionModel extends ModelBase implements IProductInCollectionModel {
  private readonly log = debug(ProductInCollectionModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findAll(search: ProductInCollectionsSearch): Promise<Omit<ProductInCollection, 'id'>[]> {
    return this.db
      .selectFrom('product_in_collection')
      .where('product_id', '=', search.product_id)
      .select(['product_id', 'collection_id'])
      .execute();
  }

  public async upsert(input: ProductInCollectionsInput): Promise<void> {
    this.log('upsert', { input });
    
    await this.db
      .deleteFrom('product_in_collection')
      .where('product_id', '=', input.product_id)
      .execute();

    if (input.collections.length > 0) {
      const values = input.collections.map(collection_id => ({ collection_id, product_id: input.product_id }));
      this.log('upsert', { values });
      
      await this.db
        .insertInto('product_in_collection')
        .values(values)
        .execute();
    }
  }
}
