import Koa from 'koa';
import Router from 'koa-router';
import { errorHandler } from '../api-app/errorHandler';
import accounts from './accounts';

const app = new Koa();
const router = new Router();

app.use(router.routes())
app.use(router.allowedMethods());
app.use(errorHandler);
app.use(accounts.routes());


export default app;