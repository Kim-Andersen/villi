import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { errorHandler } from './errorHandler';
import locationsAPI from './locations';
import photos from './photos';
import tagged from './tagged';
import vendors from './vendors';

const app = new Koa();
const router = new Router();

app.use(router.routes())
app.use(router.allowedMethods());
app.use(errorHandler);
app.use(vendors.routes());
app.use(tagged.routes());
app.use(photos.routes());
app.use(locationsAPI.routes());

router.get('/', async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = { message: 'Welcome to the Villi API.' };
  ctx.status = HttpStatus.OK;
  await next();
});

export const apiApp = app;