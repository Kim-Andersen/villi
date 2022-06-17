import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import geo from './geo';
import places from './places';
import users from './users';

const app = new Koa();
const router = new Router();

app.use(router.routes())
app.use(router.allowedMethods());
app.use(users.routes());
app.use(places.routes());
app.use(geo.routes());

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  ctx.body = { message: 'Welcome to the p API!' };
  ctx.status = HttpStatus.OK;
  await next();
});

export const apiApp = app;