import { Pool, QueryResult } from 'pg';
import { getEnvVar } from '../environment';

const pool = new Pool({
  connectionString: getEnvVar('DATABASE_URL')
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
    console.log('executed query', { query, rows: result.rowCount, duration })
    return result;
  }
}

const db = new Database();
export default db;