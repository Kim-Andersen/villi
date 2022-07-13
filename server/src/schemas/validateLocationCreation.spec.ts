import { LocationCreation } from '../shared/types';
import { validateLocationCreation } from './validateLocationCreation';

describe('validateLocationCreation', () => {
  test('sanity', () => {
    expect(validateLocationCreation({})).toBeFalsy();
  });

  test('sanity', () => {
    const creation: LocationCreation = {
      type: 'administration',
      name: 'name',
      street_name: 'street_name',
      street_number: '1',
      postal_code: '1000',
      city: 'city',
      country: 'ch',
      point: {
        latitude: 46.5328874,
        longitude: 6.612212468
      },
      opening_hours: [
        {
          open: {
            day: 0,
            time: "1700"
          },
          close: {
            day: 0,
            time: "0900"
          }

        }
      ]
    };
    expect(validateLocationCreation(creation)).toBeTruthy();
  });
});