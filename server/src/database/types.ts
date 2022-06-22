import { QueryResult } from 'pg';

export type TransactionQuery = { query: string, params?: any[] };

export interface IDatabase {
  /**
   * Tests the database connection.
   */
  testConnection(): Promise<boolean>;
  /**
   * Executes a query with optional paramters. 
   */
  query<Type>(query: string, params?: any[]): Promise<QueryResult<Type>>;
  /**
   * Perform a transaction.
   */
  transaction(queries: Array<TransactionQuery>): Promise<void>
}
