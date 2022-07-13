import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { taggedService } from '../../services';
import { taggedSchema, TaggedSearch, taggedSearchSchema } from '../../shared';

const log = debug('/locations');

const router = new Router({
  prefix: '/tagged'
});

router.get('/', async (ctx: Koa.Context) => {
  log(ctx.query);
  const search: TaggedSearch = await taggedSearchSchema.parse(ctx.query);
  log('get entity tags', { search });
  ctx.body = await taggedService.findAllEntityTags(search);
  ctx.status = httpStatus.OK;
});

router.post('/', async (ctx: Koa.Context) => {
  const input = await taggedSchema.parse(ctx.request.body);
  log('set entity tags', { input });
  await taggedService.setEntityTags(input);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

export default router;