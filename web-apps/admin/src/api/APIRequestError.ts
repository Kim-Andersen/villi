export class APIRequestError extends Error {
  constructor(public readonly response: Response) {
    super('API error');
  }
}