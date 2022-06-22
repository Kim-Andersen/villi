import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { userRepo } from '../../database/repositories';

const router = new Router({
  prefix: '/users'
});

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = await userRepo.find();
  ctx.status = httpStatus.OK;
});

export default router;