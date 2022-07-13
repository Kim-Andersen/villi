/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('vendor_location', {
    id: 'id',
    created_at: { type: 'TIMESTAMPTZ', default: 'NOW()', notNull: true },
    updated_at: { type: 'TIMESTAMPTZ' },
    vendor_id: { type: 'integer', references: 'vendor', onDelete: 'CASCADE', notNull: true },
    location_id: { type: 'integer', references: 'location', onDelete: 'CASCADE', notNull: true },
    types: { type: "jsonb", notNull: true, comment: '@type {LocationTypes}' },
    note: { type: 'text' },
    opening_hours: { type: 'jsonb', comment: '@type {OpeningHours}' }
  }, {
    constraints: {
      unique: ['vendor_id', 'location_id']
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('vendor_location');
}
