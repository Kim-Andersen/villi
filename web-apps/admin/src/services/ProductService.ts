import { IBackendAPI } from '../api/types';
import { Product, ProductCollection, ProductCollectionId, ProductCollectionInput, ProductId, ProductInCollection, ProductInput, VendorId } from '../shared';
import snackbarService from '../snackbar/snackbarService';

export default class ProductService {
  public readonly isWorking = this.api.isWorking;

  constructor(private readonly api: IBackendAPI) {}

  public async createCollection(input: ProductCollectionInput): Promise<ProductCollection> {
    const collection = await this.api.post<ProductCollection>('/product-collections', input);
    snackbarService.showSnackbar('Product collection created.', 'success');
    return collection;
  }

  public async deleteProductCollection(id: ProductCollectionId): Promise<void> {
    await this.api.delete(`/product-collections/${id}`);
    snackbarService.showSnackbar('Product collection deleted.', 'success');
  }

  public async setProductInCollections(productId: ProductId, collections: ProductCollectionId[]): Promise<void> {
    await this.api.post(`/products/${productId}/collections`, { collections });
    snackbarService.showSnackbar('Product collection updated.', 'success');
  }

  public async getProductCollections(productId: ProductId): Promise<Omit<ProductInCollection, 'id'>[]> {
    return this.api.get<Omit<ProductInCollection, 'id'>[]>(`/products/${productId}/collections`);
  }

  public async getCollections(vendorId: VendorId): Promise<ProductCollection[]> {
    return this.api.get<ProductCollection[]>(`/product-collections?vendor_id=${vendorId}`);
  }

  public async getProduct(productId: ProductId): Promise<Product> {    
    return this.api.get<Product>(`/products/${productId}`);
  }

  public async updateProduct(productId: ProductId, input: ProductInput): Promise<{ updated_at: Date }> {    
    const result = await this.api.put<{ updated_at: Date }>(`/products/${productId}`, input);
    snackbarService.showSnackbar('Product updated.', 'success');
    return result;
  }

  public async addProduct(input: ProductInput): Promise<Product> {    
    const product = await this.api.post<Product>(`/products`, input);
    snackbarService.showSnackbar('Product created.', 'success');
    return product;
  }

  public async deleteProduct(productId: ProductId): Promise<void> {
    await this.api.delete(`/products/${productId}`);
    snackbarService.showSnackbar('Product deleted.', 'success');
  }
}
