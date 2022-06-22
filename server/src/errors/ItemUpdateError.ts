import { IError } from './types';

/**
 * Error thrown by repositories when failing to update an item.
 */
export class ItemUpdateError extends Error implements IError {
  constructor(message?: string) {
    super(message || 'Failed to update item');
  }
};