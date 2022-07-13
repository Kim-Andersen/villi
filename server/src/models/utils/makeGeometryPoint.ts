import assert from 'assert';
import { String } from 'aws-sdk/clients/acm';
import { RawBuilder, sql } from 'kysely';
import { isNumber } from 'lodash';
import { LatLng } from '../../shared';

/**
 * Returns an Postgres insertable geometry point.
 * @example
 * makeGeometryPoint([46.5328874, 6.612212468])
 * 
 * => "ST_GeomFromText('POINT(46.5328874 6.612212468)', 4326)"
 */
export function makeGeometryPoint(latLng: LatLng): RawBuilder<String> {
  assert(latLng.length === 2);
  assert(isNumber(latLng[0]));
  assert(isNumber(latLng[1]));
  return sql<string>`ST_GeomFromText('POINT(${sql.raw(latLng[0].toString())} ${sql.raw(latLng[1].toString())})', 4326)`;
}