import { PlaceCreation } from './types';

export const PlaceRules = {
  name: { maxLength: 100 },
  description: { maxLength: 500 },
  street_name: { maxLength: 100 },
  street_number: { maxLength: 10 },
  postal_code: { maxLength: 20 },
  city: { maxLength: 50 }
};

export const MediaRules = {
  name: { maxLength: 50 },
  type: { maxLength: 20 }
}

export const placeCreationDefaults: PlaceCreation = {
  name: 'Villi',
  description: 'Description of the place...',
  street_name: 'Chemin Aimé-Steinlen',
  street_number: '3',
  postal_code: '1004',
  city: 'Lausanne',
  coordinates: [46.5328874, 6.612212468]
}