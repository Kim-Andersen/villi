
import Button from '@mui/material/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { productService, vendorService } from '../../services';
import { Vendor } from '../../shared';
import { Product, productInputSchema, VendorId } from '../../shared/types';
import ActionBar from '../common/ActionBar';
import ProductList from './ProductList';

export default function VendorProducts(): React.ReactElement {
  const navigate = useNavigate();
  const vendor = useOutletContext<Vendor>();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    const products = await vendorService.getProducts(vendor.id as VendorId);
    setProducts(products);
  }, [vendor.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  async function handleCreateProduct() {
    setCreatingProduct(true);
    const productInput = productInputSchema.parse({
      vendor_id: vendor.id,
      offer_id: '',
      title: '[New product]',
      description: '',
      channel: 'local',
      price: 10.00,
      currency: 756, // CH
      highlights: []
    });
    const product = await productService.addProduct(productInput);
    navigate(`${product.id}`);
  }

  return (
    <React.Fragment>
      <ActionBar>
        <Button variant='outlined' onClick={handleCreateProduct} disabled={creatingProduct}>Add Product</Button>
      </ActionBar>
      {products && 
        <ProductList products={products} onItemClick={productId => navigate(`${productId}`)} />}
    </React.Fragment>
  );
}