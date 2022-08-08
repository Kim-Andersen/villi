/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('product', {
    id: 'id',
    vendor_id: { type: 'integer', references: 'vendor', onDelete: 'CASCADE', notNull: true },
    offer_id: { type: 'varchar(50)', notNull: true, 'comment': 'A unique identifier string provided by the merchant.' },
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('current_timestamp'), notNull: true },
    updated_at: { type: 'TIMESTAMPTZ' },
    title: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true },
    channel: { type: 'varchar(6)', notNull: true, comment: '"online" or "local"' },
    price: { type: 'numeric(6, 2)', notNull: true },
    sale_price: { type: 'numeric(6, 2)', comment: 'Optional discounted price.' },
    currency: { type: 'numeric(3, 0)', notNull: true, comment: 'Currency three-digit numeric code (ISO 4217).' },
    highlights: { type: 'text[]', comment: ' List of items for the product highlights section.' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('product');
}
