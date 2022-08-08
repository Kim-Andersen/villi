import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { photoService, productService } from '../../services';
import { parseId, ProductId, productInputSchema } from '../../shared';

const log = debug('/products');

const router = new Router({
  prefix: '/products'
});

router.post('/', async (ctx: Koa.Context) => {
  const input = await productInputSchema.parseAsync(ctx.request.body);
  log('create product', { input });
  ctx.body = await productService.createProduct(input);
  ctx.status = httpStatus.CREATED;
});

router.put('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  const input = await productInputSchema.parseAsync(ctx.request.body);
  log('update product', { productId, input });
  ctx.body = await productService.updateProduct(productId, input);
  ctx.status = httpStatus.CREATED;
});

router.get('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('get product', { productId });
  const product = await productService.findById(productId);
  if (product) {
    ctx.body = product;
    ctx.status = httpStatus.OK;
  } else {
    ctx.body = {};
    ctx.status = httpStatus.NOT_FOUND;
  }
});

router.delete('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('delete product', { productId });
  await productService.deleteProduct(productId);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

router.get('/:productId/photos', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('get product photos', { productId });

  ctx.body = await photoService.findAllEntityPhotos('product_id', productId);
  ctx.status = httpStatus.OK;
});

export default router;