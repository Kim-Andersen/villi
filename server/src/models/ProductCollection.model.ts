import debug from 'debug';
import type { Database } from '../database';
import { ProductCollection, ProductCollectionId, ProductCollectionInput, ProductCollectionSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IProductCollectionModel } from './types';

export default class ProductCollectionModel extends ModelBase implements IProductCollectionModel {
  private readonly log = debug(ProductCollectionModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findAll(search: ProductCollectionSearch): Promise<ProductCollection[]> {
    this.log('findByVendorId', { search });

    let query = this.db
      .selectFrom('product_collection');
    
    if (search.vendor_id) {
      query = query.where('vendor_id', '=', search.vendor_id);
    }

    return query
      .selectAll()
      .execute();
  }

  public async insert(input: ProductCollectionInput): Promise<ProductCollection> {
    this.log('insert', { input });

    return await this.db
      .insertInto('product_collection')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async update(id: ProductCollectionId, input: ProductCollectionInput): Promise<ProductCollection> {
    this.log('update', { id, input });

    return await this.db
      .updateTable('product_collection')
      .set(input)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async delete(id: ProductCollectionId): Promise<void> {
    this.log('delete', { id });

    await this.db
      .deleteFrom('product_collection')
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }
}
