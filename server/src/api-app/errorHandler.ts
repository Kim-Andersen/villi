import debug from 'debug';
import Koa, { HttpError } from 'koa';
import { BadRequestError } from '../errors';

const log = debug('API error');

export const errorHandler : any = async (ctx : Koa.Context, next: Koa.Next ) => {
  try {
    await next();
  } catch (error) {
    log(error);

    if (error instanceof BadRequestError) {
      ctx.status = error.status;
      ctx.body = {
        error: {
          message: error.message,
          ...error.options
        }
      };
    } else if (error instanceof HttpError) {
      console.log('HttpError');
      console.log(error.expose);
      console.log(error.headers);
      console.log(error.message);
      console.log(error.name);
      console.log(error.status);
      console.log(error.statusCode);
      

    } else {
      console.log('error', error);
      console.log('typeof error', typeof error);
      
      throw error; // Let Koa handle it.
      // ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      // ctx.body = {
      //   error: {
      //     message: error instanceof Error ? error.message : 'Internal server error'
      //   }
      // };
    }
  }
}