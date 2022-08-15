/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('product_collection', {
    id: 'id',
    vendor_id: { type: 'integer', references: 'vendor', onDelete: 'CASCADE', notNull: true },
    name: { type: 'varchar(50)', notNull: true },
    description: { type: 'text' }
  });

  pgm.createTable('product_in_collection', {
    id: 'id',
    product_id: { type: 'integer', references: 'product', onDelete: 'CASCADE', notNull: true },
    collection_id: { type: 'integer', references: 'product_collection', onDelete: 'CASCADE', notNull: true }
  }, {
    constraints: {
      unique: ['product_id', 'collection_id']
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('product_in_collection');
  pgm.dropTable('product_collection');
}
