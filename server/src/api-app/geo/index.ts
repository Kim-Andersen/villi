import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { geoService } from '../../services';

const router = new Router({
  prefix: '/geo'
});

router.get('/autocomplete', async (ctx: Koa.Context) => {
  const query = ctx.query['query'];
  ctx.assert(typeof query === 'string', httpStatus.BAD_REQUEST, 'Missing query param');
  ctx.assert(query.length >= 5, httpStatus.BAD_REQUEST, 'query param be contain at least 5 characters');
  
  ctx.body = await geoService.autocomplete(query);;
  ctx.status = httpStatus.OK;
});

router.get('/code', async (ctx: Koa.Context) => {
  const query = ctx.query['query'];
  ctx.assert(typeof query === 'string', httpStatus.BAD_REQUEST, 'Missing query param');
  ctx.assert(query.length >= 5, httpStatus.BAD_REQUEST, 'query param be contain at least 5 characters');
  
  ctx.body = await geoService.geocode(query);
  ctx.status = httpStatus.OK;
});

export default router;