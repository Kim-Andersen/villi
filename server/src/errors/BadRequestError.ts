import { IError } from './types';

export class BadRequestError extends Error implements IError {
  constructor(message?: string) {
    super(message || 'Bad request.');
  }
};