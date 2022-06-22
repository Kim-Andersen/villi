import debug from 'debug';
import { ItemCreateError, ItemDeleteError, ItemUpdateError } from '../../errors';
import { Location, Place, PlaceCreation, PlaceId, PlaceUpdate, PlaceUpdateResult } from '../../shared/types';
import { sql } from '../sql';
import { IDatabase } from '../types';

export interface IPlacesRepo {
  searchNearby(location: Location, radius: number): Promise<Place[]>;
  /**
   * Find places.
   */
  findPlaces(): Promise<Place[]>;
  /**
   * Create a new place.
   * 
   * @throws {ItemCreateError}
   */
  create(creation: PlaceCreation): Promise<Place>;
  /**
   * Update an existing place.
   * 
   * @throws {ItemUpdateError}
   */
  update(placeUpdate: PlaceUpdate): Promise<PlaceUpdateResult>;
  /**
   * Delete a place.
   * 
   * @throws {ItemDeleteError}
   */
  delete(placeId: PlaceId): Promise<void>;
}

export default class PlacesRepo implements IPlacesRepo {
  private readonly log: debug.Debugger;

  constructor(private readonly db: IDatabase) {
    this.log = debug(PlacesRepo.name)
  }
  
  public async searchNearby(location: Location, radius: number): Promise<Place[]> {
    this.log('searchNearby', { location, radius });
    const { rows } = await this.db.query<Place>(sql`
      SELECT *
      FROM places
      WHERE ST_DistanceSphere(location::geometry, ST_MakePoint($1,$2)) <= $3
    `, [location.latitude, location.longitude, radius]);
    return rows;
  }

  public async findPlaces(): Promise<Place[]> {
    this.log('findPlaces');
    const { rows } = await this.db.query<Place>(sql`
      SELECT *, ST_AsGeoJSON(location)::json->'coordinates' as coordinates 
      FROM places ORDER BY id ASC
    `);
    return rows;
  }

  public async create(creation: PlaceCreation): Promise<Place> {
    this.log(`Create place`, creation);

    const query = sql`
      INSERT INTO places(name,description,street_name,street_number,postal_code,city,location)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `;
    const { name, description, street_name, street_number, postal_code, city, coordinates } = creation;
    const params = [
      name ?? 'New place',
      description ?? '',
      street_name ?? '',
      street_number ?? '0',
      postal_code ?? '',
      city ?? '',
      coordinates ? `POINT(${coordinates[0]} ${coordinates[1]})` : `POINT(46.5281434 6.6089567)`
    ];
    const result = await this.db.query<Place>(query, params);

    if (result.rowCount === 1) {
      return result.rows[0];
    }

    const message = 'Failed to create place';
    this.log(message, { creation });
    throw new ItemCreateError(message);
  }

  public async update(placeUpdate: PlaceUpdate): Promise<PlaceUpdateResult> {
    this.log(`Update place`, placeUpdate);

    const query = sql`
      UPDATE places SET 
        updated_at = NOW(),
        name = $2,
        description = $3,
        street_name = $4,
        street_number = $5,
        postal_code = $6,
        city = $7,
        location = $8
      WHERE id = $1
      RETURNING "updated_at"
    `;
    const { id, name, description, street_name, street_number, postal_code, city, coordinates} = placeUpdate;
    const params = [id, name, description, street_name, street_number, postal_code, city, `POINT(${coordinates[0]} ${coordinates[1]})`];
    const result = await this.db.query<PlaceUpdateResult>(query, params);

    if (result.rowCount !== 1) {
      const message = `Failed to update place`;
      this.log(message, { placeUpdate });
      throw new ItemUpdateError(message);
    }

    const updated_at = result.rows[0].updated_at;
    return { 
      id: placeUpdate.id,
      updated_at 
    };
  }

  public async delete(placeId: PlaceId): Promise<void> {
    this.log(`Delete place id ${placeId}`);

    const result = await this.db.query(sql`DELETE FROM places WHERE id = ${placeId}`);
    if (result.rowCount !== 1) {
      const message = `Failed to delete place`;
      this.log(message, { placeId });
      throw new ItemDeleteError(message);
    }
  }
}
