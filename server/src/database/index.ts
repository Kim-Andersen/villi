import { Pool, QueryResult } from 'pg';
import { envVar } from '../environment';

const pool = new Pool({
  connectionString: envVar('DATABASE_URL')
});

pool.connect

pool.on('error', err => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

class Database {
  public async testConnection(): Promise<boolean> {
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    return true;
  }

  public async query<Type>(query: string, params?: any[]): Promise<QueryResult<Type>> {
    const start = Date.now();
    const result = await pool.query(query, params);
    const duration = `${Date.now() - start} ms`;
    console.log('executed query', { query, rows: result.rowCount, duration });
    return result;
  }

  public async transaction(queries: Array<TransactionQuery>): Promise<void> {
    const start = Date.now();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const { query, params } of queries) {
        await this.query(query, params);
      }

      const duration = `${Date.now() - start} ms`;
      console.log('Executed transaction', { duration, queryCount: queries.length });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

const db = new Database();
export default db;

type TransactionQuery = { query: string, params?: any[] };