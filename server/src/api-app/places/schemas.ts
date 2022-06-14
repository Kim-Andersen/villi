import Ajv, { JSONSchemaType } from 'ajv';
import AjvErrors from 'ajv-errors';
import { PlaceRules } from '../../shared/constants';
import { PlaceCreation } from '../../shared/types';

const ajv = new Ajv({ allErrors: true });
AjvErrors(ajv);

export const placeCreationSchema: JSONSchemaType<PlaceCreation> = {
  type: "object",
  required: ["name"],
  additionalProperties: false,
  properties: {
    name: { type: "string", "minLength": 1, "maxLength": PlaceRules.name.maxLength },
    description: { type: "string", "minLength": 1, "maxLength": PlaceRules.description.maxLength },
    street_name: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_name.maxLength },
    street_number: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_number.maxLength },
    postal_code: { type: "string", "minLength": 1, "maxLength": PlaceRules.postal_code.maxLength },
    city: { type: "string", "minLength": 1, "maxLength": PlaceRules.city.maxLength },
    coordinates: { type: "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
  },
  errorMessage: {
    properties: {
      name: "Name should be a text with length >= 1 and <= 100",
      description: "Description should be a text with length >= 1 and <= 500",
    },
  }
}
export const validatePlaceCreation = ajv.compile(placeCreationSchema);

export const placeUpdateSchema: JSONSchemaType<PlaceCreation> = {
  type: "object",
  required: ["name"],
  additionalProperties: false,
  properties: {
    name: { type: "string", "minLength": 1, "maxLength": PlaceRules.name.maxLength },
    description: { type: "string", "minLength": 1, "maxLength": PlaceRules.description.maxLength },
    street_name: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_name.maxLength },
    street_number: { type: "string", "minLength": 1, "maxLength": PlaceRules.street_number.maxLength },
    postal_code: { type: "string", "minLength": 1, "maxLength": PlaceRules.postal_code.maxLength },
    city: { type: "string", "minLength": 1, "maxLength": PlaceRules.city.maxLength },
    coordinates: { type: "array", "minItems": 2, "maxItems": 2, "items": { "type": "number" } }
  },
  errorMessage: {
    properties: {
      name: "Name should be a text with length >= 1 and <= 100",
      description: "Description should be a text with length >= 1 and <= 500",
    },
  },
}
export const validatePlaceUpdate = ajv.compile(placeUpdateSchema);