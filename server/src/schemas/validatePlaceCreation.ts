import { JSONSchemaType } from 'ajv';
import { LocationRules, PlaceRules } from '../shared/constants';
import { PlaceCreation } from '../shared/types';
import ajv from './ajv';

export const placeCreationSchema: JSONSchemaType<PlaceCreation> = {
  type: "object",
  required: ["name", "description", "street_name", "street_number", "postal_code", "city", "coordinates"],
  additionalProperties: false,
  properties: {
    name: { type: "string", "minLength": 1, "maxLength": PlaceRules.name.maxLength },
    description: { type: "string", "minLength": 1, "maxLength": PlaceRules.description.maxLength },
    street_name: { type: "string", "minLength": 1, "maxLength": LocationRules.street_name.maxLength },
    street_number: { type: "string", "minLength": 1, "maxLength": LocationRules.street_number.maxLength },
    postal_code: { type: "string", "minLength": 1, "maxLength": LocationRules.postal_code.maxLength },
    city: { type: "string", "minLength": 1, "maxLength": LocationRules.city.maxLength },
    coordinates: { type: "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
  }
}
export const validatePlaceCreation = ajv.compile(placeCreationSchema);