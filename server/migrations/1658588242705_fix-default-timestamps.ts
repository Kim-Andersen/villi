/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn('vendor', 'created_at', { default: pgm.func('current_timestamp') });
  pgm.alterColumn('location', 'created_at', { default: pgm.func('current_timestamp') });
  pgm.alterColumn('vendor_location', 'created_at', { default: pgm.func('current_timestamp') });
  pgm.alterColumn('photo', 'created_at', { default: pgm.func('current_timestamp') });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn('vendor', 'created_at', { default: 'NOW()' });
  pgm.alterColumn('location', 'created_at', { default: 'NOW()' });
  pgm.alterColumn('vendor_location', 'created_at', { default: 'NOW()' });
  pgm.alterColumn('photo', 'created_at', { default: 'NOW()' });
}
