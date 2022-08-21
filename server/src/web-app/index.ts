import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { errorHandler } from '../api-app/errorHandler';
import { emailAuthService } from '../services';

const app = new Koa();
const router = new Router();

/** Routes */
app.use(router.routes())
app.use(router.allowedMethods());
app.use(errorHandler);

router.get('/', async (ctx: Koa.Context) => {
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
});

router.get('/login/email', async (ctx: Koa.Context) => {
  const token = ctx.request.query.token as string;
  try {
    const sessionToken = await emailAuthService.loginWithEmailToken(token);
    // TODO: Detect if it's a mobile device and redirect to the Villi app with the session token.
    ctx.type = 'html';
    ctx.body = `sessionToken: ${sessionToken}`;
  } catch {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = 'Invalid email token';
  }  
});

export const webApp = app;