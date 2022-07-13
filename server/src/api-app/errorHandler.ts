import debug from 'debug';
import httpStatus from 'http-status';
import Koa, { HttpError } from 'koa';
import * as Kysely from 'kysely';
import { ZodError } from 'zod';
import { BadRequestError } from '../errors';

const log = debug('API error handler');

export const errorHandler : any = async (ctx : Koa.Context, next: Koa.Next ) => {
  try {
    await next();
  } catch (error) {
    console.log('error', JSON.stringify(error));
    console.log('typeof error', typeof error);
    console.log('error instanceof ZodError', error instanceof ZodError);
    console.log('error instanceof Error', error instanceof Error);
    
    if (error instanceof Kysely.NoResultError) {
      log('Kysely.NoResultError', error);

      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        error: {
          message: error.message
        }
      };
    } else if (error instanceof BadRequestError) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        error: {
          message: error.message
        }
      };
    } else if ((error as any).name === 'ZodError') {
      /**
       * TODO: Improve how ZodError is detected.
       * Not working: "error instanceof ZodError"
       */
      log('ZodError', error);

      const zodError = error as ZodError;
      // Zod validation error.
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        error: {
          issues: zodError.issues
        }
      }
    } else if (error instanceof HttpError) {
      console.log('HttpError');
      console.log(error.expose);
      console.log(error.headers);
      console.log(error.message);
      console.log(error.name);
      console.log(error.status);
      console.log(error.statusCode);
      

    } else {
      log('error', error);
      log('typeof error', typeof error);
      
      throw error; // Let Koa handle it.
    }
  }
}