import { debug } from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { Vendor, VendorId, VendorInput, VendorSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IVendorModel } from './types';

export default class VendorModel extends ModelBase implements IVendorModel {
  private readonly log = debug(VendorModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: VendorId): Promise<Vendor> {
    this.log('findById', { id });

    return await this.db
      .selectFrom('vendor')
      .where('vendor.id', '=', id)
      .selectAll('vendor')
      .executeTakeFirstOrThrow();
  }

  public async findOne(search: VendorSearch): Promise<Vendor> {
    this.log('findOne', { search });
    const { name, description, website_url, facebook_url, instagram_url } = search;

    let query = this.db.selectFrom('vendor');
    query = name ? query.where(sql`LOWER(name)`, 'like', '%' + name.toLowerCase() + '%') : query;
    query = description ? query.where(sql`LOWER(description)`, 'like', '%' + description.toLowerCase() + '%') : query;
    query = facebook_url ? query.where(sql`LOWER(facebook_url)`, 'like', '%' + facebook_url.toLowerCase() + '%') : query;
    query = instagram_url ? query.where(sql`LOWER(instagram_url)`, 'like', '%' + instagram_url.toLowerCase() + '%') : query;
    query = website_url ? query.where(sql`LOWER(website_url)`, 'like', '%' + website_url.toLowerCase() + '%') : query;

    return query
      .selectAll('vendor')
      .executeTakeFirstOrThrow();
  }

  public async findAll(search: VendorSearch): Promise<Vendor[]> {
    this.log('findAll', { search });
    const { name, description, website_url, facebook_url, instagram_url } = search;

    let query = this.db.selectFrom('vendor');
    query = name ? query.where(sql`LOWER(name)`, 'like', '%' + name.toLowerCase() + '%') : query;
    query = description ? query.where(sql`LOWER(description)`, 'like', '%' + description.toLowerCase() + '%') : query;
    query = facebook_url ? query.where(sql`LOWER(facebook_url)`, 'like', '%' + facebook_url.toLowerCase() + '%') : query;
    query = instagram_url ? query.where(sql`LOWER(instagram_url)`, 'like', '%' + instagram_url.toLowerCase() + '%') : query;
    query = website_url ? query.where(sql`LOWER(website_url)`, 'like', '%' + website_url.toLowerCase() + '%') : query;

    return query
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

  public async deleteVendor(id: VendorId): Promise<void> {
    this.log('deleteVendor', { id });

    await this.db
      .deleteFrom('vendor')
      .where('vendor.id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
