import { Account } from '../../shared';

export interface ISessionAuthService {
  createSessionToken(account: Account): Promise<string>;
  refreshSessionToken(token: string): Promise<string>;
}