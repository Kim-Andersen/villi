/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('account', {
    id: 'id',
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('current_timestamp'), notNull: true },
    lastlogin_at: { type: 'TIMESTAMPTZ' },
    email: { type: 'varchar(50)', notNull: true },
    full_name: { type: 'varchar(50)', notNull: true },
    is_admin: { type: 'boolean', notNull: true, default: false }
  });

  pgm.createTable('invitation', {
    id: 'id',
    email: { type: 'varchar(50)', notNull: true },
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('current_timestamp'), notNull: true },
    invited_by: { type: 'integer', references: 'account', onDelete: 'CASCADE', notNull: true }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('invitation');
  pgm.dropTable('account');
}
