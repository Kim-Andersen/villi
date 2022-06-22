import { IError } from './types';

/**
 * Error thrown by repositories when failing to update an item.
 */
export class ItemDeleteError extends Error implements IError {
  constructor(message?: string) {
    super(message || 'Failed to delete item');
  }
};