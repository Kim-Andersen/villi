import { Account, AccountId } from '../../shared';

export interface IAccountService {
  findOneByEmail(email: string): Promise<Account | undefined>;
  findOneById(id: AccountId): Promise<Account | undefined>;
  /**
   * Sets the `lastlogin_at` to the current datetime for the given account.
   */
  registerLastLogin(id: AccountId): Promise<void>;
}