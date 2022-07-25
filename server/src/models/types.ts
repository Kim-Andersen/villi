import { EntityPhoto, EntityPhotoInput, EntityPhotoSearch, Location, LocationId, LocationInput, LocationSearch, Photo, PhotoId, PhotoInput, PhotoSearch, Tagged, TaggedSearch, Vendor, VendorId, VendorInput, VendorLocation, VendorLocationDetails, VendorLocationId, VendorLocationInput, VendorLocationSearch, VendorSearch } from '../shared';

export interface IVendorModel {
  findById(id: VendorId): Promise<Vendor>;
  findOne(search: VendorSearch): Promise<Vendor>;
  findAll(search: VendorSearch): Promise<Vendor[]>
  insertVendor(insert: VendorInput): Promise<VendorId>;
  updateVendor(id: VendorId, update: VendorInput): Promise<Pick<Vendor, 'updated_at'>>;
  deleteVendor(id: VendorId): Promise<void>;
}

export interface ILocationModel {
  update(locationId: LocationId, input: LocationInput): Promise<Pick<Location, "updated_at">>;
  findById(id: LocationId): Promise<Location>;
  findOne(search: LocationSearch): Promise<Location | undefined>;
  findAll(search: LocationSearch): Promise<Location[]>
  insertLocation(insert: LocationInput): Promise<LocationId>;
  deleteLocation(id: LocationId): Promise<void>;
}

export interface IVendorLocationModel {
  findById(id: VendorLocationId): Promise<VendorLocationDetails>;
  findOne(search: VendorLocationSearch): Promise<VendorLocationDetails | undefined>;
  findAll(search: VendorLocationSearch): Promise<VendorLocationDetails[]>
  insert(insert: VendorLocationInput): Promise<Pick<VendorLocation, "id">>;
  update(id: VendorLocationId, input: VendorLocationInput): Promise<Pick<VendorLocation, 'updated_at'>>;
  delete(id: VendorLocationId): Promise<void>;
}

export interface ITaggedModel {
  findAllEntityTags(search: TaggedSearch): Promise<string[]>;
  upsertEntityTags(input: Tagged): Promise<void>;
}

export interface IPhotoModel {
  findById(id: PhotoId): Promise<Photo>;
  findAll(search: PhotoSearch): Promise<Photo[]>;
  insertPhoto(input: PhotoInput): Promise<Photo>;
  insertPhotoWithReservedId(id: PhotoId, input: PhotoInput): Promise<Photo>;
  deleteById(id: PhotoId): Promise<void>;
  deleteByKey(key: string): Promise<void>;
  reservePhotoId(): Promise<PhotoId>;
}

export interface IEntityPhotoModel {
  findAll(search: EntityPhotoSearch): Promise<Photo[]>;
  insert(input: EntityPhotoInput): Promise<EntityPhoto>;
  delete(input: EntityPhotoInput): Promise<void>;
  countPhotoEntities(photo_id: PhotoId): Promise<number>;
}