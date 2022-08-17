import { debug } from 'debug';
import { SelectQueryBuilder, sql } from 'kysely';
import { From } from 'kysely/dist/cjs/parser/table-parser';
import type { Database, Kyselyfied } from '../database';
import { Vendor, VendorId, VendorInput, VendorSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IVendorModel, VendorDeleteOptions, VendorSearchOptions } from './types';

export default class VendorModel extends ModelBase implements IVendorModel {
  private readonly log = debug(VendorModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: VendorId, options: VendorSearchOptions = {}): Promise<Vendor> {
    this.log('findById', { id });

    const { includedDeleted } = options;

    let query = this.db
      .selectFrom('vendor')
      .where('vendor.id', '=', id);
    
    if (includedDeleted !== true) {
      query = query.where('deleted_at', 'is', null);
    }

    return query
      .selectAll('vendor')
      .executeTakeFirstOrThrow();
  }

  public async findOne(search: VendorSearch, options: VendorSearchOptions = {}): Promise<Vendor> {
    this.log('findOne', { search });
    
    return this.buildSearchQuery(search, options)
      .selectAll('vendor')
      .executeTakeFirstOrThrow();
  }

  public async findAll(search: VendorSearch, options: VendorSearchOptions = {}): Promise<Vendor[]> {
    this.log('findAll', { search });
    
    return this.buildSearchQuery(search, options)
      .selectAll('vendor')
      .execute();
  }

  public async insertVendor(insert: VendorInput): Promise<VendorId> {
    this.log('insertVendor', { insert });

    const { id } = await this.db
      .insertInto('vendor')
      .values(insert)
      .returning('id')
      .executeTakeFirstOrThrow();
    return id as VendorId;
  }

  public async updateVendor(vendorId: VendorId, update: VendorInput): Promise<Pick<Vendor, 'updated_at'>> {
    this.log('updateVendor', { vendorId, update });

    return this.db
      .updateTable('vendor')
      .set({ ...update, updated_at: new Date() })
      .where('id', '=', vendorId)
      .returning('updated_at')
      .executeTakeFirstOrThrow();
  }

  public async deleteVendor(vendorId: VendorId, { permanently }: VendorDeleteOptions = { permanently: false }): Promise<void> {
    this.log('deleteVendor', { vendorId });

    if (permanently === true) {
      await this.db
        .deleteFrom('vendor')
        .where('vendor.id', '=', vendorId)
        .executeTakeFirstOrThrow();
    } else {
      await this.db
        .updateTable('vendor')
        .set({ deleted_at: new Date() })
        .where('id', '=', vendorId)
        .executeTakeFirstOrThrow();
    }
  }

  private buildSearchQuery(search: VendorSearch, options: VendorSearchOptions): SelectQueryBuilder<From<Kyselyfied, "vendor">, "vendor", {}> {
    const { name, description, website_url, facebook_url, instagram_url } = search;
    const { includedDeleted } = options;

    let query = this.db.selectFrom('vendor');

    query = includedDeleted !== true ? query.where('deleted_at', 'is', null) : query;
    query = name ? query.where(sql`LOWER(name)`, 'like', '%' + name.toLowerCase() + '%') : query;
    query = description ? query.where(sql`LOWER(description)`, 'like', '%' + description.toLowerCase() + '%') : query;
    query = facebook_url ? query.where(sql`LOWER(facebook_url)`, 'like', '%' + facebook_url.toLowerCase() + '%') : query;
    query = instagram_url ? query.where(sql`LOWER(instagram_url)`, 'like', '%' + instagram_url.toLowerCase() + '%') : query;
    query = website_url ? query.where(sql`LOWER(website_url)`, 'like', '%' + website_url.toLowerCase() + '%') : query;

    return query;
  }
}
