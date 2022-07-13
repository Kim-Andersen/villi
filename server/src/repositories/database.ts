import debug from 'debug';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import config from '../config';
import { Database } from '../models/database';

const log = debug('database');

export const database: Database = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.postgres.connectionString
    })
  }),
  log: (event): void => {  
    if (event.level === 'query') {
      log(event.query.sql)
      log(event.query.parameters)
    }
  }
});