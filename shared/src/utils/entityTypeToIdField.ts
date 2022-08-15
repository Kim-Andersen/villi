import { EntityType } from '../schemas';

export function entityTypeToIdField(entityType: EntityType): 'vendor_id' | 'location_id' | 'vendor_location_id' | 'product_id' {
  switch(entityType) {
    case 'vendor': return 'vendor_id';
    case 'location': return 'location_id';
    case 'vendor_location': return 'vendor_location_id';
    case 'product': return 'product_id';
    default: throw new RangeError(`EntityType ${entityType} not supported.`);
  }
}