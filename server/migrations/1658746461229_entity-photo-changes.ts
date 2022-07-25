/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('entity_photo', ['entity_id', 'entity_type']);
  pgm.addColumns('entity_photo', {
    vendor_id: { type: 'integer', references: 'vendor', onDelete: 'CASCADE' },
    location_id: { type: 'integer', references: 'location', onDelete: 'CASCADE' },
    vendor_location_id: { type: 'integer', references: 'vendor_location', onDelete: 'CASCADE' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('entity_photo', ['vendor_id', 'location_id', 'vendor_location_id']);
  pgm.addColumns('entity_photo', {
    entity_id: { type: "integer", notNull: true },
    entity_type: { type: "varchar(20)", notNull: true, comment: "Type of entity (Vendor, Location, VendorLocation, etc.)" }
  });
}
