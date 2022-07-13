import debug from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { Location, LocationId, LocationInput, LocationSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { ILocationModel } from './types';
import { makeGeometryPoint } from './utils/makeGeometryPoint';
export default class LocationModel extends ModelBase implements ILocationModel {
  private readonly log = debug(LocationModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findById(id: LocationId): Promise<Location> {
    this.log('findById', { id });
    
    return await this.db
      .selectFrom('location')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  public async findOne(search: LocationSearch): Promise<Location | undefined> {
    this.log('findOne', { search });

    const { name, description, street_name, street_number, postal_code, city, country } = search;

    let query = this.db.selectFrom('location');
    query = name ? query.where(sql`LOWER(name)`, 'like', '%' + name.toLowerCase() + '%') : query;
    query = description ? query.where(sql`LOWER(description)`, 'like', '%' + description.toLowerCase() + '%') : query;
    query = street_name ? query.where(sql`LOWER(street_name)`, 'like', '%' + street_name.toLowerCase() + '%') : query;
    query = street_number ? query.where(sql`LOWER(street_number)`, 'like', '%' + street_number.toLowerCase() + '%') : query;
    query = postal_code ? query.where(sql`LOWER(postal_code)`, 'like', '%' + postal_code.toLowerCase() + '%') : query;
    query = city ? query.where(sql`LOWER(city)`, 'like', '%' + city.toLowerCase() + '%') : query;
    query = country ? query.where(sql`LOWER(country)`, 'like', '%' + country.toLowerCase() + '%') : query;

    return query
      .selectAll('location')
      .select([
        sql`ST_AsGeoJSON(point)::jsonb->'coordinates'`.as('point')
      ])
      .executeTakeFirst()
  }

  public async findAll(search: LocationSearch): Promise<Location[]> {
    this.log('findAll', { search });

    const { name, description, street_name, street_number, postal_code, city, country } = search;

    

    let query = this.db.selectFrom('location');
    query = name ? query.where(sql`LOWER(name)`, 'like', '%' + name.toLowerCase() + '%') : query;
    query = description ? query.where(sql`LOWER(description)`, 'like', '%' + description.toLowerCase() + '%') : query;
    query = street_name ? query.where(sql`LOWER(street_name)`, 'like', '%' + street_name.toLowerCase() + '%') : query;
    query = street_number ? query.where(sql`LOWER(street_number)`, 'like', '%' + street_number.toLowerCase() + '%') : query;
    query = postal_code ? query.where(sql`LOWER(postal_code)`, 'like', '%' + postal_code.toLowerCase() + '%') : query;
    query = city ? query.where(sql`LOWER(city)`, 'like', '%' + city.toLowerCase() + '%') : query;
    query = country ? query.where(sql`LOWER(country)`, 'like', '%' + country.toLowerCase() + '%') : query;

    return query
      .selectAll('location')
      .select([
        sql`ST_AsGeoJSON(point)::jsonb->'coordinates'`.as('point')
      ])
      .execute();
  }

  public async insertLocation(input: LocationInput): Promise<LocationId> {
    const { id } = await this.db
      .insertInto('location')
      .values({
        ...input,
        point: makeGeometryPoint(input.point)
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    return id as LocationId;
  }

  public async update(locationId: LocationId, input: LocationInput): Promise<Pick<Location, "updated_at">> {
    return await this.db
      .updateTable('location')
      .set({
        ...input, 
        updated_at: new Date(), 
        point: makeGeometryPoint(input.point)
      })
      .where('id', '=', locationId)
      .returning('updated_at')
      .executeTakeFirstOrThrow();
  }

  public async deleteLocation(id: LocationId): Promise<void> {
    this.log('deleteLocation', { id });

    await this.db
      .deleteFrom('location')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
