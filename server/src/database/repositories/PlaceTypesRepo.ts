import debug from 'debug';
import { Cache } from 'node-ts-cache';
import createCache from '../../cache';
import { PlaceId, PlaceType, TypeOfPlace, TypeOfPlaceId } from '../../shared/types';
import { sql } from '../sql';
import { IDatabase } from '../types';

const typesCache = createCache();

export interface IPlaceTypesRepo {
  /**
   * Returns all types associated to a place.
   */
  findByPlace(placeId: PlaceId): Promise<TypeOfPlaceId[]>
  /**
   * Returns all types.
   */
  find(): Promise<TypeOfPlace[]>;
  /**
   * Upserts types for a place.
   */
  upsertForPlace(placeId: PlaceId, types: TypeOfPlaceId[]): Promise<void>
}

export default class PlaceTypesRepo implements IPlaceTypesRepo {
  private readonly log: debug.Debugger;

  constructor(private readonly db: IDatabase) {
    this.log = debug(PlaceTypesRepo.name)
  }

  public async findByPlace(placeId: PlaceId): Promise<TypeOfPlaceId[]> {
    this.log(`findByPlace`, { placeId });
    const query = sql`SELECT type_id FROM place_types WHERE place_id = $1`;
    const { rows } = await this.db.query<Pick<PlaceType, 'type_id'>>(query, [placeId]);
    return rows.map(r => r.type_id);
  }

  @Cache(typesCache, { ttl: 10 })
  public async find(): Promise<TypeOfPlace[]> {
    const { rows } = await this.db.query<TypeOfPlace>(sql`SELECT id, name FROM types_of_places`);
    this.log(`Find types of places`, { rows });
    return rows;
  }

  public async upsertForPlace(placeId: PlaceId, types: TypeOfPlaceId[]): Promise<void> {
    this.log(`Update place types for place id ${placeId}`, { types });

    await this.db.transaction([
      {
        query: sql`DELETE FROM place_types WHERE place_id = $1`,
        params: [placeId]
      },
      {
        query: sql`INSERT INTO place_types (place_id, type_id) VALUES ${types.map(id => `(${placeId}, ${id})`)}`
      }
    ])
  }
}
