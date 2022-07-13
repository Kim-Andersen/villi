import { z } from 'zod';

export const locationTypeEnum = z.enum(["admin", "outlet"]);
export type LocationType = z.infer<typeof locationTypeEnum>;
export type LocationTypes = LocationType[];
export default LocationTypes;