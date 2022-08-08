/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns('entity_photo', {
    product_id: { type: 'integer', references: 'product', onDelete: 'CASCADE' },
    type: { type: 'varchar(20)', comment: 'Optional descriptor of the photo, ie. "profile_pic", "default" or "primary".' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('entity_photo', ['product_id', 'type'])
}
