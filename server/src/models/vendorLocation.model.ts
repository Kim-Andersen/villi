import debug from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { VendorLocation, VendorLocationDetails, VendorLocationId, VendorLocationInput, VendorLocationSearch } from '../shared';
import { ModelBase } from './ModelBase';
import type { IVendorLocationModel } from './types';

export default class VendorLocationModel extends ModelBase implements IVendorLocationModel {
  private readonly log = debug(VendorLocationModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: VendorLocationId): Promise<VendorLocationDetails> {
    this.log('findById', { id });

    return this.db
      .selectFrom('location')
      .innerJoin('vendor_location', 'vendor_location.location_id', 'location.id')
      .selectAll('vendor_location')
      .select([sql`to_json(location.*)::jsonb`.as('location')])
      .where('vendor_location.id', '=', id)
      .castTo<VendorLocationDetails>()
      .executeTakeFirstOrThrow();
  }
  
  public async findOne(search: VendorLocationSearch): Promise<VendorLocationDetails | undefined> {
    this.log('findOne', { search });

    let query = this.db
      .selectFrom('location')
      .innerJoin('vendor_location', 'vendor_location.location_id', 'location.id');

    query = search.id ? query.where('vendor_location.id', '=', search.id) : query;
    query = search.vendor_id ? query.where('vendor_location.vendor_id', '=', search.vendor_id) : query;
    query = search.location_id ? query.where('vendor_location.location_id', '=', search.location_id) : query;
    
    return query
      .selectAll('vendor_location')
      .select([sql`to_json(location.*)::jsonb`.as('location')])
      .castTo<VendorLocationDetails>()
      .executeTakeFirst();
  }

  public async findAll(search: VendorLocationSearch): Promise<VendorLocationDetails[]> {
    this.log('findAll', { search });

    let query = this.db
      .selectFrom('location')
      .innerJoin('vendor_location', 'vendor_location.location_id', 'location.id');

    query = search.vendor_id ? query.where('vendor_location.vendor_id', '=', search.vendor_id) : query;
    query = search.location_id ? query.where('vendor_location.location_id', '=', search.location_id) : query;
    
    return query
      .selectAll('vendor_location')
      .select(sql`to_json(location.*)::jsonb`.as('location'))
      .castTo<VendorLocationDetails>()
      .execute();
  }

  public async insert(input: VendorLocationInput): Promise<Pick<VendorLocation, "id">> {
    this.log('insert', { input });

    return this.db
      .insertInto('vendor_location')
      .values({
        ...input, 
        types: sql`${JSON.stringify(input.types)}`,
        opening_hours: sql`${JSON.stringify(input.opening_hours)}`
      })
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  public async update(id: VendorLocationId, input: VendorLocationInput): Promise<Pick<VendorLocation, 'updated_at'>> {
    this.log('update', { input });

    return this.db
      .updateTable('vendor_location')
      .set({
        ...input, 
        types: sql`${JSON.stringify(input.types)}`,
        opening_hours: sql`${JSON.stringify(input.opening_hours)}`,
        updated_at: new Date()
      })
      .where('vendor_location.id', '=', id)
      .returning('vendor_location.updated_at')
      .executeTakeFirstOrThrow()
  }

  public async delete(id: VendorLocationId): Promise<void> {
    this.log('delete', { id });

    await this.db
      .deleteFrom('vendor_location')
      .where('id', '=', id)
      .execute();
  }

}
