/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('photo', {
    id: 'id',
    created_at: { type: 'TIMESTAMPTZ', default: 'NOW()', notNull: true },
    bucket: { type: 'text', notNull: true },
    content_type: { type: 'text', notNull: true },
    key: { type: 'text', notNull: true },
    sizes: { type: 'jsonb', notNull: true, comment: '@type {PhotoSizes}' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('photo');
}
