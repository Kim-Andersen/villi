import { JSONSchemaType } from 'ajv';
import { PlaceTypesUpdate } from '../shared/types';
import ajv from './ajv';

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
