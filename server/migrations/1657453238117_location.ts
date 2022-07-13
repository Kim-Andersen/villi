/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('location', {
    id: 'id',
    created_at: { type: 'TIMESTAMPTZ', default: 'NOW()', notNull: true },
    updated_at: { type: 'TIMESTAMPTZ' },
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    street_name: { type: 'text', notNull: true },
    street_number: { type: 'text', notNull: true },
    postal_code: { type: 'text', notNull: true },
    city: { type: 'text', notNull: true },
    country: { type: 'VARCHAR(2)', notNull: true },
    point: { type: 'geometry(point,4326)', notNull: true },
    opening_hours: { type: 'jsonb', comment: '@type {OpeningHours}' }
  }, {  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('location');
}
