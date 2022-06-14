/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumn('places', 'point');
  pgm.addColumns('places', {
    location: { type: 'GEOGRAPHY(POINT,4326)', notNull: true }
  });
};

exports.down = pgm => {
  pgm.dropColumn('places', 'location');
  pgm.addColumns('places', {
    point: { type: 'Point', notNull: true }
  });
};
