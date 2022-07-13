import { z } from 'zod';

export const photoSize = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);
export type PhotoSize = z.infer<typeof photoSize>;
export type PhotoSizes = PhotoSize[];