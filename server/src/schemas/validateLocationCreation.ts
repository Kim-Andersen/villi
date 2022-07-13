import { JSONSchemaType } from 'ajv';
import { LocationRules } from '../shared/constants';
import { LocationCreation } from '../shared/db-models';
import ajv from './ajv';
import { openingHoursSchema } from './validateOpeningHours';

export const locationCreationSchema: JSONSchemaType<Omit<LocationCreation, 'id' | 'created_at' | 'updated_at'>> = {
  type: "object",
  required: ["name", "street_name", "street_number", "postal_code", "city", "country", "point"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: LocationRules.name.maxLength },
    description: { type: "string", minLength: 1, maxLength: LocationRules.description.maxLength, nullable: true },
    street_name: { type: "string", minLength: 1, maxLength: LocationRules.street_name.maxLength },
    street_number: { type: "string", minLength: 1, maxLength: LocationRules.street_number.maxLength },
    postal_code: { type: "string", minLength: 1, maxLength: LocationRules.postal_code.maxLength },
    city: { type: "string", minLength: 1, maxLength: LocationRules.city.maxLength },
    country: { type: "string", minLength: 2, maxLength: LocationRules.country.maxLength },
    point: { type: "array", minItems: 2, maxItems: 2, items: { type: "number" } },
    opening_hours: { ...openingHoursSchema, nullable: true }
  }
}
export const validateLocationCreation = ajv.compile(locationCreationSchema);