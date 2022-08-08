import { Product, ProductId, ProductInput, VendorId } from '../../shared';

export interface IProductService {
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(productId: ProductId, input: ProductInput): Promise<Pick<Product, 'updated_at'>>;
  findById(productId: ProductId): Promise<Product>;
  deleteProduct(productId: ProductId): Promise<void>;
  findAllByVendor(vendorId: VendorId): Promise<Product[]>;
}