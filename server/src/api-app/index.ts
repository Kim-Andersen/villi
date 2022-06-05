import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import db from '../database';

const app = new Koa();
const router = new Router();

/** Middlewares */
app.use(logger());
app.use(json());

/** Routes */
app.use(router.routes()).use(router.allowedMethods());

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  ctx.body = { message: 'Welcome to the p API!' };

  await next();
});

router.get('/users', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query('SELECT * FROM users')
    ctx.body = { users: res.rows };
    await next();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log(err);
    }
  }
});

router.get('/places', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query('SELECT * FROM places')
    ctx.body = { users: res.rows };
    await next();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log(err);
    }
  }
});

export const apiApp = app;