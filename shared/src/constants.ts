
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