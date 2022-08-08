import debug from 'debug';
import { IProductModel } from '../../models';
import { Product, ProductId, ProductInput, VendorId } from '../../shared';
import { IProductService } from './types';

export class ProductService implements IProductService {
  private readonly log = debug(ProductService.name);
  
  constructor(private readonly productModel: IProductModel) {
    this.log('initialize');
  }

  public async updateProduct(productId: ProductId, input: ProductInput): Promise<Pick<Product, 'updated_at'>> {
    this.log('updateProduct', { productId, input });
    return this.productModel.update(productId, input);
  }

  public async findAllByVendor(vendorId: VendorId): Promise<Product[]> {
    this.log('findAllByVendor', { vendorId });
    return this.productModel.findAllByVendor(vendorId);
  }

  public findById(productId: ProductId): Promise<Product> {
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