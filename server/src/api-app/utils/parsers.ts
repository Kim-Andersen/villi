import { BadRequestError } from '../../errors';

export function parseInteger(value: any, name: string): number {
  if (Number.isNaN(Number(value))) {
    throw new BadRequestError(`Invalid ${name} "${value}". Must be an integer.`);
  } else {
    return Number.parseInt(value);
  }
}

export const parsePlaceId = (value: any): number => parseInteger(value, 'place id');
export const parsePhotoId = (value: any): number => parseInteger(value, 'photo id');