import { ErrorObject } from 'ajv';
import httpStatus from 'http-status';
import { IError } from './types';

type Options = {
  validationErrors?: ErrorObject[] | null;
};

/**
 * Error thrown by repositories when failing to update an item.
 */
export class BadRequestError extends Error implements IError {
  public readonly status = httpStatus.BAD_REQUEST;
  public readonly validationErrors?: ErrorObject[];

  constructor(message: string, public readonly options: Options = {}) {
    super(message || 'Failed to create item');
  }
};