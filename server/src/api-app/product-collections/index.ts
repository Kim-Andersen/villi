import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { productService } from '../../services';
import { parseId, ProductCollectionId, productCollectionInputSchema, VendorId } from '../../shared';

const log = debug('/product-collections');

const router = new Router({
  prefix: '/product-collections'
});

router.post('/', async (ctx: Koa.Context) => {
  const input = await productCollectionInputSchema.parseAsync(ctx.request.body);
  log('create product collection', { input });
  ctx.body = await productService.createProductCollection(input);
  ctx.status = httpStatus.CREATED;
});

router.get('/', async (ctx: Koa.Context) => {
  const vendorId = parseId<VendorId>(ctx.query.vendor_id as string);
  log('get product collections', { vendorId });
  ctx.body = await productService.findProductCollectionsByVendor(vendorId);
  ctx.status = httpStatus.OK;
});

router.put('/:productCollectionId', async (ctx: Koa.Context) => {
  const productCollectionId = parseId<ProductCollectionId>(ctx.params.productCollectionId);
  const input = await productCollectionInputSchema.parseAsync(ctx.request.body);
  log('update product collection', { productCollectionId, input });
  ctx.body = await productService.updateProductCollection(productCollectionId, input);
  ctx.status = httpStatus.CREATED;
});

router.delete('/:productCollectionId', async (ctx: Koa.Context) => {
  const productCollectionId = parseId<ProductCollectionId>(ctx.params.productCollectionId);
  log('delete product collection', { productCollectionId });
  await productService.deleteProductCollection(productCollectionId);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

export default router;