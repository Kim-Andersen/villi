import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

/** Middlewares */
app.use(logger());
app.use(bodyParser());

/** Routes */
app.use(router.routes()).use(router.allowedMethods());

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  ctx.type = 'html';
  ctx.body = `
    <html>
      <title>Villi</title>
      <body>
        <h1>Villi</h1>
        <ul>
          <li><a href="/api">API</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </body>
    </html>
  `;

  await next();
});

export const webApp = app;