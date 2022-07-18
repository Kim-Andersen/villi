/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('vendor', {
    youtube_url: { type: 'text' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('vendor', 'youtube_url');
}
