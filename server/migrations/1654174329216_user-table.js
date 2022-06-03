/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'string', notNull: true, unique: true }
  });
};
