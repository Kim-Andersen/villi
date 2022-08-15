import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { productService } from '../../services';
import { parseId, ProductId, productInCollectionsInputSchema, productInputSchema } from '../../shared';

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

router.get('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('get product', { productId });
  const product = await productService.findProductById(productId);
  if (product) {
    ctx.body = product;
    ctx.status = httpStatus.OK;
  } else {
    ctx.body = {};
    ctx.status = httpStatus.NOT_FOUND;
  }
});

router.put('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  const input = await productInputSchema.parseAsync(ctx.request.body);
  log('update product', { productId, input });
  ctx.body = await productService.updateProduct(productId, input);
  ctx.status = httpStatus.CREATED;
});

router.delete('/:productId', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('delete product', { productId });
  await productService.deleteProduct(productId);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

router.get('/:productId/collections', async (ctx: Koa.Context) => {
  const productId = parseId<ProductId>(ctx.params.productId);
  log('get product collections', { productId });
  ctx.body = await productService.findProductInCollections(productId);;
  ctx.status = httpStatus.OK;
});

router.post('/:productId/collections', async (ctx: Koa.Context) => {
  const product_id = parseId<ProductId>(ctx.params.productId);
  const input = await productInCollectionsInputSchema.parseAsync({...ctx.request.body, product_id });
  log('set product collections', { input });
  await productService.setProductInCollections(input);
  ctx.body = {};
  ctx.status = httpStatus.CREATED;
});

export default router;