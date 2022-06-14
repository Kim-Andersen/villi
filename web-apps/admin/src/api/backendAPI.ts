import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { HttpMethod } from './types';

class BackendAPI {
  private workingState = new BehaviorSubject<boolean>(false);
  public working = this.workingState.asObservable().pipe(distinctUntilChanged());
  
  constructor(public readonly apiBaseUrl: string) {}

  public async get<ResponseType>(resource: string): Promise<ResponseType> {
    return this.makeRequest<ResponseType>(resource, 'get');
  }

  public async post<ResponseType>(resource: string, data: object): Promise<ResponseType> {
    return this.makeRequest<ResponseType>(resource, 'post', { body: data });
  }

  public async put<ResponseType>(resource: string, data: object): Promise<ResponseType> {
    return this.makeRequest<ResponseType>(resource, 'put', { body: data });
  }

  public async delete(resource: string): Promise<Response> {
    return this.makeRequest(resource, 'delete');
  }

  public get isWorking(): boolean {
    return this.workingState.value;
  }

  private async makeRequest<ResponseType>(resource: string, method: HttpMethod, options: { body?: object } = {}): Promise<ResponseType> {
    this.workingState.next(true);

    const url = `${this.apiBaseUrl}${resource}`;
    const requestInit: RequestInit = {
      headers: { 'Content-Type': 'application/json' },
    };
    if (typeof options.body === 'object') {
      requestInit.body = JSON.stringify(options.body);
    }
    if (method !== 'get') {
      requestInit.method = method;
    }

    // Optionally log request.
    console.log(method, url, requestInit);

    try {
      const response = await fetch(url, requestInit);
      if (response.ok) {
        return response.json() as unknown as ResponseType;
      }
      throw response;
    } catch(error) {
      const message = error instanceof Error ? error.message : error;
      throw new Error(`API request error: ${message}`);
    } finally {
      this.workingState.next(false);
    }
  }
}

export const backendAPI = new BackendAPI('http://localhost:3001/api');