/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.renameColumn('places', 'created', 'created_at');
  pgm.addColumns('places', {
    'updated_at': { type: 'TIMESTAMPTZ' },
    'description': { type: 'VARCHAR(500)', notNull: true, default: '' },
    'street_name': { type: 'VARCHAR(100)', notNull: true },
    'street_number': { type: 'integer', notNull: true },
    'postal_code': { type: 'VARCHAR(20)', notNull: true },
    'city': { type: 'VARCHAR(20)', notNull: true },
  })
};

exports.down = pgm => {
  pgm.renameColumn('places', 'created_at', 'created');
  pgm.dropColumns('places', ['description', 'street_name', 'street_number', 'postal_code', 'city']);
};
