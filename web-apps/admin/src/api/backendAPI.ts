import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { APIResponse } from '../shared/types';
import errorHandlerService from '../snackbar/errorHandlerService';
import { APIRequestError } from './APIRequestError';
import { HttpMethod, IBackendAPI } from './types';

class BackendAPI implements IBackendAPI {
  private workingState = new BehaviorSubject<boolean>(false);
  public working = this.workingState.asObservable().pipe(distinctUntilChanged());
  
  constructor(public readonly apiBaseUrl: string) {}

  public async get<PayloadType>(resource: string): Promise<APIResponse<PayloadType, unknown>> {
    return this.makeRequest<PayloadType>(resource, 'get');
  }

  public async post<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>> {
    return this.makeRequest<PayloadType>(resource, 'post', { body: body === null ? undefined : body, raw });
  }

  public async put<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>> {
    return this.makeRequest<PayloadType>(resource, 'put', { body: body === null ? undefined : body, raw });
  }

  public async patch<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>> {
    return this.makeRequest<PayloadType>(resource, 'put', { body: body === null ? undefined : body, raw });
  }

  public async delete<PayloadType>(resource: string): Promise<APIResponse<PayloadType, unknown>> {
    return this.makeRequest<PayloadType>(resource, 'delete');
  }

  public get isWorking(): boolean {
    return this.workingState.value;
  }

  private async makeRequest<PayloadType>(resource: string, method: HttpMethod, options: { body?: object | undefined, raw?: any } = {}): Promise<APIResponse<PayloadType, unknown>> {
    this.workingState.next(true);

    const url = `${this.apiBaseUrl}${resource}`;
    const requestInit: RequestInit = {};

    if (options.raw) {
      requestInit.body = options.raw;
    } else if (typeof options.body === 'object') {
      requestInit.headers = { 'Content-Type': 'application/json' };
      requestInit.body = JSON.stringify(options.body);
    } else if (method === 'post' || method === 'put') {
      throw new TypeError(`Nothing to send. One of body or raw parameters must be defined.`);
    }

    if (method !== 'get') {
      requestInit.method = method;
    }

    console.log(method, url, requestInit);

    let response: Response;
    try {
      response = await fetch(url, requestInit);
      if (response.ok) {
        return await response.json();
      }

      throw response;
    } catch(error) {
      if (error instanceof Response) {
        errorHandlerService.handleError(new APIRequestError(error.clone()));
      } else if (error instanceof Error) {
        errorHandlerService.handleError(error);
      }
      throw error;
    } finally {
      this.workingState.next(false);
    }
  }
}

export const backendAPI = new BackendAPI('/api');