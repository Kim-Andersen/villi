import debug from 'debug';
import { IProductCollectionModel, IProductInCollectionModel, IProductModel } from '../../models';
import { Product, ProductCollection, ProductCollectionId, ProductCollectionInput, productCollectionSearchSchema, ProductId, ProductInCollection, ProductInCollectionsInput, productInCollectionsSearchSchema, ProductInput, VendorId } from '../../shared';
import { IProductService } from './types';

export class ProductService implements IProductService {
  private readonly log = debug(ProductService.name);
  
  constructor(
    private readonly productModel: IProductModel, 
    private readonly productCollectionModel: IProductCollectionModel,
    private readonly productInCollectionModel: IProductInCollectionModel) {
    this.log('initialize');
  }

  public async findProductInCollections(product_id: ProductId): Promise<Omit<ProductInCollection, 'id'>[]> {
    return this.productInCollectionModel.findAll(productInCollectionsSearchSchema.parse({ product_id }));
  }
  
  public async setProductInCollections(input: ProductInCollectionsInput): Promise<void> {
    return this.productInCollectionModel.upsert(input);  
  }

  public async createProductCollection(input: ProductCollectionInput): Promise<ProductCollection> {
    return this.productCollectionModel.insert(input);
  }

  public async updateProductCollection(id: ProductCollectionId, input: ProductCollectionInput): Promise<ProductCollection> {
    return this.productCollectionModel.update(id, input);
  }

  public async deleteProductCollection(id: ProductCollectionId): Promise<void> {
    return this.productCollectionModel.delete(id);
  }

  public async findProductCollectionsByVendor(vendor_id: VendorId): Promise<ProductCollection[]> {
    return this.productCollectionModel.findAll(productCollectionSearchSchema.parse({ vendor_id }));
  }

  public async updateProduct(productId: ProductId, input: ProductInput): Promise<Pick<Product, 'updated_at'>> {
    this.log('updateProduct', { productId, input });
    return this.productModel.update(productId, input);
  }

  public async findAllProductsByVendor(vendorId: VendorId): Promise<Product[]> {
    this.log('findAllByVendor', { vendorId });
    return this.productModel.findAllByVendor(vendorId);
  }

  public findProductById(productId: ProductId): Promise<Product> {
    this.log('findById', { productId });
    return this.productModel.findById(productId);
  }

  public deleteProduct(productId: ProductId): Promise<void> {
    this.log('deleteProduct', { productId });
    return this.productModel.delete(productId);
  }

  public async createProduct(input: ProductInput): Promise<Product> {
    this.log('createProduct', { input });

    return this.productModel.insert(input);
  }
}