import { EntityPhotoDetails, EntityPhotoInput, EntityPhotoSearch, Location, LocationId, LocationInput, LocationSearch, Photo, PhotoId, PhotoInput, PhotoSearch, Product, ProductCollection, ProductCollectionId, ProductCollectionInput, ProductCollectionSearch, ProductId, ProductInCollection, ProductInCollectionsInput, ProductInCollectionsSearch, ProductInput, Tagged, TaggedSearch, Vendor, VendorId, VendorInput, VendorLocation, VendorLocationDetails, VendorLocationId, VendorLocationInput, VendorLocationSearch, VendorSearch } from '../shared';

export type VendorDeleteOptions = {
  /**
   * Set to true to permanently delete the vendor.
   * Otherwise the `deleted_at` flag will be set, thus not actually deleting the vendor.
   */
  permanently: boolean;
};

export type VendorSearchOptions = { includedDeleted?: boolean; };

export interface IVendorModel {
  findById(id: VendorId, options?: VendorSearchOptions): Promise<Vendor>;
  findOne(search: VendorSearch, options?: VendorSearchOptions): Promise<Vendor>;
  findAll(search: VendorSearch, options?: VendorSearchOptions): Promise<Vendor[]>
  insertVendor(insert: VendorInput): Promise<VendorId>;
  updateVendor(id: VendorId, update: VendorInput): Promise<Pick<Vendor, 'updated_at'>>;
  deleteVendor(id: VendorId, options?: VendorDeleteOptions): Promise<void>;
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
  findAll(search: EntityPhotoSearch): Promise<EntityPhotoDetails[]>;
  insert(input: EntityPhotoInput): Promise<EntityPhotoDetails>;
  delete(input: EntityPhotoInput): Promise<void>;
  countPhotoEntities(photo_id: PhotoId): Promise<number>;
}

export interface IProductModel {
  findById(id: ProductId): Promise<Product>;
  findAllByVendor(vendorId: VendorId): Promise<Product[]>;
  insert(input: ProductInput): Promise<Product>;
  update(id: ProductId, input: ProductInput): Promise<Pick<Product, 'updated_at'>>;
  delete(productId: ProductId): Promise<void>;
}
export interface IProductCollectionModel {
  findAll(search: ProductCollectionSearch): Promise<ProductCollection[]>;
  insert(input: ProductCollectionInput): Promise<ProductCollection>;
  update(id: ProductCollectionId, input: ProductCollectionInput): Promise<ProductCollection>;
  delete(id: ProductCollectionId): Promise<void>;
}

export interface IProductInCollectionModel {
  findAll(search: ProductInCollectionsSearch): Promise<Omit<ProductInCollection, 'id'>[]>;
  upsert(input: ProductInCollectionsInput): Promise<void>;
}