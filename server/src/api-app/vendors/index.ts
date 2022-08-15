import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { productService, vendorService } from '../../services';
import { parseId, VendorId, vendorInputSchema, VendorLocationId, vendorLocationInputSchema } from '../../shared';

const log = debug('/vendors');

const router = new Router({
  prefix: '/vendors'
});

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = await vendorService.getAllVendors();
  ctx.status = httpStatus.OK;
});

router.post('/', async (ctx: Koa.Context) => {
  const input = await vendorInputSchema.parseAsync(ctx.request.body);
  log('add vendor', { input });

  ctx.body = await vendorService.createVendor(input);
  ctx.status = httpStatus.OK;
});

router.get('/:vendorId', async (ctx: Koa.Context) => {
  const vendorId = parseId<VendorId>(ctx.params.vendorId);
  log('get vendor details', { vendorId });

  ctx.body = await vendorService.getVendorDetails(vendorId);
  ctx.status = httpStatus.OK;
});

router.put('/:vendorId', async (ctx: Koa.Context) => {
  const vendorId = parseId<VendorId>(ctx.params.vendorId);
  const input = await vendorInputSchema.parseAsync(ctx.request.body);
  log('update vendor', { vendorId, input });

  ctx.body = await vendorService.updateVendor(vendorId, input);
  ctx.status = httpStatus.OK;
});

router.delete('/:vendorId', async (ctx: Koa.Context) => {
  const vendorId = parseId<VendorId>(ctx.params.vendorId);
  log('delete vendor', { vendorId });

  await vendorService.deleteVendor(vendorId);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

router.get('/:vendorId/locations', async (ctx: Koa.Context) => {
  const vendor_id = parseId<VendorId>(ctx.params.vendorId);
  log('get vendor locations', { vendor_id });

  ctx.body = await vendorService.findVendorLocations({ vendor_id });
  ctx.status = httpStatus.OK;
});

router.post('/:vendorId/locations', async (ctx: Koa.Context) => {
  log('add vendor location body', ctx.request.body);
  const input = await vendorLocationInputSchema.parseAsync(ctx.request.body);
  log('add vendor location', { input });

  ctx.body = await vendorService.addVendorLocation(input);
  ctx.status = httpStatus.CREATED;
});

router.put('/:vendorId/locations/:id', async (ctx: Koa.Context) => {
  const id = parseId<VendorLocationId>(ctx.params.id);
  const input = await vendorLocationInputSchema.parseAsync(ctx.request.body);
  log('update vendor location', { id, input });
  ctx.body = await vendorService.updateVendorLocation(id, input);
  ctx.status = httpStatus.OK;
});

router.delete('/:vendorId/locations/:id', async (ctx: Koa.Context) => {
  const id = parseId<VendorLocationId>(ctx.params.id);
  log('delete vendor location', { id });

  await vendorService.removeVendorLocation(id);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

router.get('/:vendorId/products', async (ctx: Koa.Context) => {
  const vendor_id = parseId<VendorId>(ctx.params.vendorId);
  log('get vendor products', { vendor_id });

  ctx.body = await productService.findAllProductsByVendor(vendor_id);
  ctx.status = httpStatus.OK;
});

export default router;