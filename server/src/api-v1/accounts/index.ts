import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { ItemNotFoundError } from '../../errors';
import { emailAuthService } from '../../services';
import { emailSchema } from '../../shared';

const log = debug('/accounts');
const router = new Router({ prefix: '/accounts' });

router.post('/login/email', async (ctx: Koa.Context) => {
  const email = emailSchema.parse(ctx.request.body.email);
  try {
    await emailAuthService.sendEmailWithLoginLink(email);
    ctx.status = httpStatus.OK;
    ctx.body = {};
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        error: {
          message: error.message
        }
      };    
    }
  }
});

export default router;