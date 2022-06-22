import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { errorHandler } from './errorHandler';
import geoAPI from './geo';
import placesAPI from './places';
import usersAPI from './users';

const app = new Koa();
const router = new Router();

app.use(errorHandler);
app.use(router.routes())
app.use(router.allowedMethods());
app.use(usersAPI.routes());
app.use(placesAPI.routes());
app.use(geoAPI.routes());

router.get('/', async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = { message: 'Welcome to the Villi API.' };
  ctx.status = HttpStatus.OK;
  await next();
});

export const apiApp = app;