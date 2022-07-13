import { PlaceCreation } from './types';

export const PlaceRules = {
  name: { maxLength: 100 },
  description: { maxLength: 500 }
};

export const LocationRules = {
  name: { maxLength: 50 },
  description: { maxLength: 500 },
  street_name: { maxLength: 50 },
  street_number: { maxLength: 5 },
  postal_code: { maxLength: 10 },
  city: { maxLength: 20 },
  country: { maxLength: 2 }
};

export const MediaRules = {
  name: { maxLength: 50 },
  type: { maxLength: 20 }
};

export const placeCreationDefaults: PlaceCreation = {
  name: 'Villi',
  description: 'Description of the place...',
  street_name: 'Chemin Aimé-Steinlen',
  street_number: '3',
  postal_code: '1004',
  city: 'Lausanne',
  coordinates: [46.5328874, 6.612212468]
};

