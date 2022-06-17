/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createType('photo_size', ['xs', 'sm', 'md', 'lg', 'xl']);
  pgm.createTable('photos', {
    id: 'id',
    created_at: { type: 'TIMESTAMPTZ', notNull: true, default: 'NOW()' },
    key: { type: 'VARCHAR(50)', notNull: true },
    type: { type: 'VARCHAR(20)', notNull: true },
    bucket: { type: 'VARCHAR(20)', notNull: true },
    sizes: { type: "photo_size[]", notNull: true, comment: 'The available photo sizes' }
  });
  pgm.createTable('place_photos', {
    place_id: { primaryKey : true, type: 'integer', references: 'places', notNull: true, onDelete: 'CASCADE' },
    photo_id: { primaryKey : true, type: 'integer', references: 'photos', notNull: true, onDelete: 'CASCADE' },
    
  });
};

exports.down = pgm => {
  pgm.dropTable('place_photos');
  pgm.dropTable('photos');
  pgm.dropType('photo_size');
};
