import { Product, ProductCollection, ProductCollectionId, ProductCollectionInput, ProductId, ProductInCollection, ProductInCollectionsInput, ProductInput, VendorId } from '../../shared';

export interface IProductService {
  findProductInCollections(product_id: ProductId): Promise<Omit<ProductInCollection, 'id'>[]>;
  /**
   * Sets the collections for a given product.
   */
  setProductInCollections(input: ProductInCollectionsInput): Promise<void>;
  createProductCollection(input: ProductCollectionInput): Promise<ProductCollection>;
  updateProductCollection(id: ProductCollectionId, input: ProductCollectionInput): Promise<ProductCollection>
  deleteProductCollection(id: ProductCollectionId): Promise<void>;
  findProductCollectionsByVendor(vendor_id: VendorId): Promise<ProductCollection[]>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(productId: ProductId, input: ProductInput): Promise<Pick<Product, 'updated_at'>>;
  findProductById(productId: ProductId): Promise<Product>;
  deleteProduct(productId: ProductId): Promise<void>;
  findAllProductsByVendor(vendorId: VendorId): Promise<Product[]>;
}