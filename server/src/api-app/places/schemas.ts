import Ajv, { JSONSchemaType } from 'ajv';
import { PlaceRules } from '../../shared/constants';
import { PlaceCreation, PlaceTypesUpdate, PlaceUpdate } from '../../shared/types';

const ajv = new Ajv({ allErrors: true });

export const placeCreationSchema: JSONSchemaType<PlaceCreation> = {
  type: "object",
  required: ["name", "description", "street_name", "street_number", "postal_code", "city", "coordinates"],
  additionalProperties: false,
  properties: {
    name: { type: "string", "minLength": 1, "maxLength": PlaceRules.name.maxLength },
    description: { type: "string", "minLength": 1, "maxLength": PlaceRules.description.maxLength },
    street_name: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_name.maxLength },
    street_number: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_number.maxLength },
    postal_code: { type: "string", "minLength": 1, "maxLength": PlaceRules.postal_code.maxLength },
    city: { type: "string", "minLength": 1, "maxLength": PlaceRules.city.maxLength },
    coordinates: { type: "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
  }
}
export const validatePlaceCreation = ajv.compile(placeCreationSchema);

export const placeUpdateSchema: JSONSchemaType<PlaceUpdate> = {
  type: "object",
  required: ["id", "name"],
  additionalProperties: false,
  properties: {
    id: { type: "integer" },
    name: { type: "string", "minLength": 1, "maxLength": PlaceRules.name.maxLength },
    description: { type: "string", "minLength": 1, "maxLength": PlaceRules.description.maxLength },
    street_name: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_name.maxLength },
    street_number: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_number.maxLength },
    postal_code: { type: "string", "minLength": 1, "maxLength": PlaceRules.postal_code.maxLength },
    city: { type: "string", "minLength": 1, "maxLength": PlaceRules.city.maxLength },
    coordinates: { type: "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
  }
}
export const validatePlaceUpdate = ajv.compile(placeUpdateSchema);

export const placeTypesUpdateSchema: JSONSchemaType<PlaceTypesUpdate> = {
  type: "object",
  required: ["types"],
  additionalProperties: false,
  properties: {
    types: {
      type: "array",
      minItems: 1,
      items: { "type": "integer" },
      uniqueItems: true
    }
  }
};
export const validatePlaceTypesUpdate = ajv.compile(placeTypesUpdateSchema);
