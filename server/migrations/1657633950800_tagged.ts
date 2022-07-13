/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('tagged', {
    entity_id: { type: "integer", notNull: true },
    type: { type: "varchar(20)", notNull: true, comment: "Type of entity (Vendor, VendorLocation, etc.)" },
    tags: { type: 'text[]', notNull: true }
  }, {
    constraints: {
      unique: ['entity_id', 'type']
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('tagged');
}
