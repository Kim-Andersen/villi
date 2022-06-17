/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('types_of_places', {
    id: { type: 'integer', unique: true, primaryKey: true, notNull: true },
    name: { type: 'varchar(50)', unique: true, notNull: true }
  });

  pgm.createTable('place_types', {
    place_id: { primaryKey : true, type: 'integer', references: 'places', notNull: true, onDelete: 'CASCADE' },
    type_id: { primaryKey : true, type: 'integer', references: 'types_of_places', notNull: true, onDelete: 'CASCADE' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('place_types');
  pgm.dropTable('types_of_places');
}
