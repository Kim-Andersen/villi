/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('vendor', {
    deleted_at: { type: 'TIMESTAMPTZ' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('vendor', 'deleted_at');
}
