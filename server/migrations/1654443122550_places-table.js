/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('places', {
    id: 'id',
    created: { type: 'TIMESTAMPTZ', notNull: true, default: 'NOW()' },
    name: { type: 'VARCHAR(100)', notNull: true },
    point: { type: 'Point', notNull: true }
  });
};

exports.down = pgm => {
  pgm.dropTable('places');
};
