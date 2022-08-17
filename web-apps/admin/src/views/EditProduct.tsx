import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { omit, pick } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import EditProductAvailability from '../components/product/EditProductAvailability';
import EditProductCustom from '../components/product/EditProductCustom';
import EditProductHighlights from '../components/product/EditProductHighlights';
import EditProductInfo from '../components/product/EditProductInfo';
import EditProductPhotos from '../components/product/EditProductPhotos';
import EditProductPrice from '../components/product/EditProductPrice';
import ProductCollections from '../components/product/ProductCollections';
import { productService } from '../services';
import { parseId, Product, ProductId, productInputSchema, Vendor, VendorId } from '../shared';

export default function EditProduct(): React.ReactElement {
  const navigate = useNavigate();
  const vendor = useOutletContext<Vendor>();
  const productId = parseId<ProductId>(useParams().productId!);
  const [product, setProduct] = useState<Product | null>(null);
  const [changes, setChanges] = useState<Partial<Product>>({});
  
  const fetchProduct = useCallback(async () => {
    const product = await productService.getProduct(productId);
    setProduct(product);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  function handleOnChange(_changes: Partial<Product>) {
    setChanges(Object.assign({}, changes, _changes));
  }

  function renderEditProduct(product: Product) {
    return (
      <React.Fragment>
        <EditProductInfo product={pick(product, 'title', 'description')} onChange={handleOnChange} />
        <EditProductPrice product={pick(product, 'price', 'sale_price')} currency={product.currency} onChange={handleOnChange} />
        <EditProductHighlights product={pick(product, 'highlights')} onChange={handleOnChange} />
        <EditProductCustom product={pick(product, 'offer_id')} onChange={handleOnChange} />
        <ProductCollections vendorId={vendor.id as VendorId} productId={product.id as ProductId} />
        <EditProductAvailability product={pick(product, 'channel')} onChange={handleOnChange} />
        <EditProductPhotos productId={product.id as ProductId} />
      </React.Fragment>
    );
  }

  async function handleSaveClick() {
    const input = Object.assign({}, omit(product, ['id', 'created_at', 'updated_at']), changes);
    input.currency = Number(input.currency);
    input.price = Number(input.price);
    input.sale_price = input.sale_price ? Number(input.sale_price) : undefined;

    const productInput = productInputSchema.parse(input);
    const { updated_at } = await productService.updateProduct(productId, productInput);
    product!.updated_at = updated_at;
    setProduct(product);
    setChanges({});
  }

  async function handleDeleteProductClick() {
    if (window.confirm('Sure you want to delete this product?')) {
      await productService.deleteProduct(productId);
      navigate('../products');
    }
  }

  return (
    <React.Fragment>
      <Tooltip title="All products" placement="top">
        <IconButton onClick={() => navigate('../products')}>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>

      <Button variant='contained' disabled={Object.keys(changes).length === 0} onClick={handleSaveClick}>Save</Button>
      <IconButton onClick={handleDeleteProductClick}>
        <DeleteIcon />
      </IconButton>

      <Grid container spacing={2}>
        {product && renderEditProduct(product)}
      </Grid>

    </React.Fragment>
  );
}