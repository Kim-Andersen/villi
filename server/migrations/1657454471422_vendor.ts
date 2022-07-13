/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('vendor', {
    id: 'id',
    name: { type: 'text', notNull: true },
    created_at: { type: 'TIMESTAMPTZ', default: 'NOW()', notNull: true },
    updated_at: { type: 'TIMESTAMPTZ' },
    description: { type: 'text' },
    website_url: { type: 'text' },
    facebook_url: { type: 'text' },
    instagram_url: { type: 'text' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('vendor');
}
