import debug from 'debug';
import { Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import config from '../config';
import { Tables } from '../shared/generated/db';


/**
 * Sets `Generated<T>` for `id` and `created_at` properties so they work correctly with kysely's type system.
 * 
 * https://github.com/koskimas/kysely#minimal-example
 */
type WithKyselyGeneratedType<T extends object> = {
  [K in keyof T]: K extends 'id'  ? Generated<number> 
    : K extends 'created_at' ? Generated<Date>
    : T[K];
};

export type Kyselyfy<T extends {[key: string]: any}> = {
  [K in keyof T]: WithKyselyGeneratedType<T[K]>
};

export type Kyselyfied = Kyselyfy<Tables>;
export type Database = Kysely<Kyselyfied>;

const log = debug('database');

export const pool = new Pool({
  connectionString: config.postgres.connectionString,
});

export const database: Database = new Kysely<Kyselyfy<Tables>>({
  dialect: new PostgresDialect({ pool }),
  log: (event): void => {  
    if (event.level === 'query') {
      log(event.query.sql)
      log(event.query.parameters)
    }
  }
});