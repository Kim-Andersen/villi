INSERT INTO types_of_places (id, name)
VALUES
  (1, 'bakery'),
  (2, 'supermarket'),
  (3, 'grocery'),
  (4, 'store'),
  (5, 'nature'),
  (6, 'restaurant')
ON CONFLICT(id) DO UPDATE SET name = EXCLUDED.name