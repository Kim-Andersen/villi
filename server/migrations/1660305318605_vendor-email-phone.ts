/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns('vendor', {
    email: { type: 'varchar(50)' },
    phone: { type: 'varchar(20)' }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('vendor', ['email', 'phone']);
}
