import { Observable } from 'rxjs';
import { APIResponse } from '../shared/types';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export interface IBackendAPI {
  working: Observable<boolean>;
  isWorking: boolean;
  get<PayloadType>(resource: string): Promise<APIResponse<PayloadType, unknown>>;
  post<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>>;
  put<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>>;
  patch<PayloadType>(resource: string, body: object | null, raw?: any): Promise<APIResponse<PayloadType, unknown>>;
  delete<PayloadType>(resource: string): Promise<APIResponse<PayloadType, unknown>>;
}