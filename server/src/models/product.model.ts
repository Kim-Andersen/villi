import debug from 'debug';
import type { Database } from '../database';
import { Product, ProductId, ProductInput, VendorId } from '../shared';
import { ModelBase } from './ModelBase';
import { IProductModel } from './types';

export default class ProductModel extends ModelBase implements IProductModel {
  private readonly log = debug(ProductModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: ProductId): Promise<Product> {
    this.log('findById', { id });
    
    return await this.db
      .selectFrom('product')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  public async findAllByVendor(vendor_id: VendorId): Promise<Product[]> {
    this.log('findAllByVendor', { vendor_id });
    
    return this.db
      .selectFrom('product')
      .where('vendor_id', '=', vendor_id)
      .selectAll()
      .execute();
  }

  public async insert(input: ProductInput): Promise<Product> {
    this.log('insert', { input });

    return await this.db
      .insertInto('product')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async update(id: ProductId, input: ProductInput): Promise<Pick<Product, "updated_at">> {
    this.log('update', { id, input });

    return await this.db
      .updateTable('product')
      .set({
        ...input, 
        updated_at: new Date()
      })
      .where('id', '=', id)
      .returning('updated_at')
      .executeTakeFirstOrThrow();
  }

  public async delete(id: ProductId): Promise<void> {
    this.log('delete', { id });

    await this.db
      .deleteFrom('product')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
