import { IError } from './types';

/**
 * Error thrown by repositories when an item was not found.
 */
export class ItemNotFoundError extends Error implements IError {
  constructor(message?: string) {
    super(message || 'Item not found');
  }
};