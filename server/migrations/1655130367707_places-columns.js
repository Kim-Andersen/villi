/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.alterColumn('places', 'street_number', {
    type: 'VARCHAR(10)', notNull: true
  });
  pgm.alterColumn('places', 'city', {
    type: 'VARCHAR(50)', notNull: true
  });
};

exports.down = pgm => {
  pgm.alterColumn('places', 'street_number', {
    type: 'integer', notNull: true
  });
  pgm.alterColumn('places', 'city', {
    type: 'VARCHAR(20)', notNull: true
  });
};
