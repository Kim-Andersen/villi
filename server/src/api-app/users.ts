import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import db from '../database';

const router = new Router({
  prefix: '/users'
});

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query('SELECT * FROM users')
    ctx.body = { users: res.rows };
    ctx.status = HttpStatus.OK;
    await next();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log(err);
    }
  }
});

export default router;