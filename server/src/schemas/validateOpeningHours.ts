import { JSONSchemaType } from 'ajv';
import OpeningHours from '../shared/types/OpeningHours';
import ajv from './ajv';

export const openingHoursSchema: JSONSchemaType<OpeningHours> = {
  type: "array",
  uniqueItems: true,
  maxItems: 7,
  items: {
    type: "object",
    properties: {
      open: {
        type: "object",
        required: ["day"],
        additionalProperties: false,
        properties: {
          day: { type: "integer", minimum: 0, maximum: 6 },
          time: { type: "string", format: "24hour", nullable: true }
        }
      },
      close: {
        type: "object",
        nullable: true,
        required: ["day"],
        additionalProperties: false,
        properties: {
          day: { type: "integer", minimum: 0, maximum: 6 },
          time: { type: "string", format: "24hour", nullable: true }
        }
      }
    },
    required: ["open"],
    additionalProperties: false,
  }
}

export const validateOpeningHours = ajv.compile(openingHoursSchema);