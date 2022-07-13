/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('entity_photo', {
    id: 'id',
    photo_id: { type: "integer", notNull: true, references: 'photo', onDelete: 'CASCADE' },
    entity_id: { type: "integer", notNull: true },
    entity_type: { type: "varchar(20)", notNull: true, comment: "Type of entity (Vendor, Location, VendorLocation, etc.)" }
  }, {
    constraints: {
      unique: ['photo_id', 'entity_id', 'entity_type']
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('entity_photo');
}
